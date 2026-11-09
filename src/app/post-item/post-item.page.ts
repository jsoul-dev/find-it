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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
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
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
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

  private compressPhoto(dataUrl: string, maxWidth = 300, quality = 0.45): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  async takePhoto(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 30,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        width: 300,
      });
      if (image.dataUrl) {
        const compressed = await this.compressPhoto(image.dataUrl, 300, 0.45);
        this.photo.set(compressed);
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

    const photoData = this.photo();

    this.itemService
      .addItem({
        type: this.type,
        name: this.name.trim(),
        description: this.description.trim(),
        contact: this.contact.trim(),
        lat: this.lat()!,
        lng: this.lng()!,
        status: 'Open',
        photo: photoData ?? undefined,
      })
      .subscribe({
        next: async (created) => {
          if (photoData && created?.id) {
            this.itemService.saveLocalPhoto(created.id, photoData);
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
          if (photoData && (err?.status === 413 || err?.status === 400)) {
            this.itemService
              .addItem({
                type: this.type,
                name: this.name.trim(),
                description: this.description.trim(),
                contact: this.contact.trim(),
                lat: this.lat()!,
                lng: this.lng()!,
                status: 'Open',
              })
              .subscribe({
                next: async (created) => {
                  if (created?.id) {
                    this.itemService.saveLocalPhoto(created.id, photoData);
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
                error: async () => {
                  this.submitting.set(false);
                  this.formError.set('Could not post item to server. Please try again.');
                  try {
                    await Haptics.notification({ type: NotificationType.Error });
                  } catch (e) {
                    void e;
                  }
                },
              });
            return;
          }

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
