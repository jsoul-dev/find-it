import {
  Component,
  AfterViewInit,
  inject,
  input,
  computed,
} from '@angular/core';
import {
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
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
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
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
  ],
})
export class ItemDetailPage implements AfterViewInit {
  private itemService = inject(ItemService);
  private map?: L.Map;

  id = input<string>();

  item = computed(() => {
    const currentId = this.id();
    return currentId ? this.itemService.getById(currentId) : undefined;
  });

  constructor() {
    addIcons({ checkmarkCircle });
  }

  ngAfterViewInit(): void {
    const current = this.item();
    if (current) {
      this.initMap(current.lat, current.lng, current.name);
    }
  }

  private initMap(lat: number, lng: number, title: string): void {
    if (this.map) return;
    this.map = L.map('detail-map').setView([lat, lng], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    L.circleMarker([lat, lng])
      .addTo(this.map)
      .bindPopup(title)
      .openPopup();
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  markClaimed(): void {
    const current = this.item();
    if (current) {
      this.itemService.markClaimed(current);
    }
  }
}
