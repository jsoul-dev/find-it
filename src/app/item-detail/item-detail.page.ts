import type { OnInit, AfterViewInit } from '@angular/core';
import { Component, inject, input, computed, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, NotificationType } from '@capacitor/haptics';
import {
  AlertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trashOutline } from 'ionicons/icons';
import * as L from 'leaflet';

import { ItemService } from '../services/item';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
  ],
})
export class ItemDetailPage implements OnInit, AfterViewInit {
  private itemService = inject(ItemService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);
  private map?: L.Map;

  id = input<string>();
  claiming = signal<boolean>(false);
  deleting = signal<boolean>(false);

  item = computed(() => {
    const currentId = this.id();
    return currentId ? this.itemService.getById(currentId) : undefined;
  });

  get photoUrl(): string | undefined {
    const current = this.item();
    return current ? this.itemService.getPhoto(current) : undefined;
  }

  constructor() {
    addIcons({ checkmarkCircle, trashOutline });

    effect(() => {
      const current = this.item();
      if (current && !this.map) {
        setTimeout(() => this.initMap(current.lat, current.lng, current.name), 100);
      }
    });
  }

  ngOnInit(): void {
    if (this.itemService.items().length === 0) {
      this.itemService.fetchItems();
    }
  }

  ngAfterViewInit(): void {
    const current = this.item();
    if (current) {
      this.initMap(current.lat, current.lng, current.name);
    }
  }

  private initMap(lat: number, lng: number, title: string): void {
    const container = document.getElementById('detail-map');
    if (!container || this.map) return;
    this.map = L.map('detail-map').setView([lat, lng], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    L.circleMarker([lat, lng]).addTo(this.map).bindPopup(title).openPopup();
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  markClaimed(): void {
    const current = this.item();
    if (!current) return;

    this.claiming.set(true);
    this.itemService.markClaimed(current).subscribe({
      next: async (updated) => {
        try {
          await Haptics.notification({ type: NotificationType.Success });
        } catch (e) {
          void e;
        }
        this.claiming.set(false);
        this.itemService.items.update((list) => list.map((i) => (i.id === updated.id ? updated : i)));
      },
      error: async (err) => {
        console.error('PUT Error:', err);
        this.claiming.set(false);
        try {
          await Haptics.notification({ type: NotificationType.Error });
        } catch (e) {
          void e;
        }
      },
    });
  }

  async confirmDelete(): Promise<void> {
    const current = this.item();
    if (!current) return;

    const alert = await this.alertCtrl.create({
      header: 'Delete Report',
      message: `Are you sure you want to delete "${current.name}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteItem(current.id);
          },
        },
      ],
    });

    await alert.present();
  }

  private deleteItem(id: string): void {
    this.deleting.set(true);
    this.itemService.deleteItem(id).subscribe({
      next: async () => {
        this.deleting.set(false);
        try {
          await Haptics.notification({ type: NotificationType.Success });
        } catch (e) {
          void e;
        }
        const toast = await this.toastCtrl.create({
          message: 'Report deleted successfully.',
          duration: 2000,
          color: 'success',
          position: 'bottom',
        });
        await toast.present();
        this.router.navigate(['/home']);
      },
      error: async (err) => {
        console.error('DELETE Error:', err);
        this.deleting.set(false);
        try {
          await Haptics.notification({ type: NotificationType.Error });
        } catch (e) {
          void e;
        }
        const toast = await this.toastCtrl.create({
          message: 'Could not delete item. Please try again.',
          duration: 2500,
          color: 'danger',
          position: 'bottom',
        });
        await toast.present();
      },
    });
  }
}
