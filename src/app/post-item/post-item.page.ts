import type { AfterViewInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, NotificationType } from '@capacitor/haptics';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonImg,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locate, camera, trash } from 'ionicons/icons';
import * as L from 'leaflet';

import { ItemService } from '../services/item';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.page.html',
  styleUrls: ['./post-item.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonImg,
  ],
})
export class PostItemPage implements AfterViewInit {
  private itemService = inject(ItemService);
  private router = inject(Router);
  private map!: L.Map;
  private locationMarker?: L.CircleMarker;

  type: 'Lost' | 'Found' = 'Lost';
  name = '';
  description = '';
  contact = '';
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);
  photo = signal<string | null>(null);
  formError = signal<string>('');
  submitting = signal<boolean>(false);

  constructor() {
    addIcons({ locate, camera, trash });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('new-map').setView([15.44825, 120.93922], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    setTimeout(() => this.map.invalidateSize(), 200);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  private updateMarker(lat: number, lng: number): void {
    this.lat.set(lat);
    this.lng.set(lng);
    if (this.locationMarker) {
      this.locationMarker.setLatLng([lat, lng]);
    } else {
      this.locationMarker = L.circleMarker([lat, lng]).addTo(this.map).bindPopup('Item Location').openPopup();
    }
  }

  async locateMe(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.map.setView([lat, lng], 17);
      this.updateMarker(lat, lng);
      this.formError.set('');
    } catch {
      this.formError.set('Could not access current location. Please check GPS permissions or tap the map.');
      try {
        await Haptics.notification({ type: NotificationType.Error });
      } catch (e) {
        void e;
      }
    }
  }

  async takePhoto(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 35,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        width: 400,
      });
      if (image.dataUrl) {
        this.photo.set(image.dataUrl);
      }
    } catch {
      this.formError.set('Camera was cancelled or unavailable.');
    }
  }

  removePhoto(): void {
    this.photo.set(null);
  }

  async submit(): Promise<void> {
    if (!this.name.trim() || !this.contact.trim() || this.lat() === null || this.lng() === null) {
      this.formError.set('Please fill in the item name, contact, and pick a location on the map.');
      try {
        await Haptics.notification({ type: NotificationType.Warning });
      } catch (e) {
        void e;
      }
      return;
    }

    this.formError.set('');
    this.submitting.set(true);

    this.itemService
      .addItem({
        type: this.type,
        name: this.name.trim(),
        description: this.description.trim(),
        contact: this.contact.trim(),
        lat: this.lat()!,
        lng: this.lng()!,
        status: 'Open',
        photo: this.photo() ?? undefined,
      })
      .subscribe({
        next: async (created) => {
          if (this.photo() && created?.id) {
            this.itemService.saveLocalPhoto(created.id, this.photo()!);
          }
          try {
            await Haptics.notification({ type: NotificationType.Success });
          } catch (e) {
            void e;
          }
          this.submitting.set(false);
          this.itemService.fetchItems();
          this.router.navigate(['/home']);
        },
        error: async (err) => {
          console.error('POST Error:', err);
          this.submitting.set(false);
          this.formError.set('Could not post item to server. Please try again.');
          try {
            await Haptics.notification({ type: NotificationType.Error });
          } catch (e) {
            void e;
          }
        },
      });
  }
}
