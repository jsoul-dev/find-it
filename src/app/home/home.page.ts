import {
  Component,
  AfterViewInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import * as L from 'leaflet';
import { ItemService } from '../services/item';
import { ItemCardComponent } from '../components/item-card/item-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    ItemCardComponent,
  ],
})
export class HomePage implements AfterViewInit {
  private itemService = inject(ItemService);
  private router = inject(Router);
  private map!: L.Map;

  items = this.itemService.items;
  filter = signal<'All' | 'Lost' | 'Found' | 'Claimed'>('All');

  filtered = computed(() => {
    const currentFilter = this.filter();
    const all = this.items();
    if (currentFilter === 'All') {
      return all;
    }
    if (currentFilter === 'Claimed') {
      return all.filter((i) => i.status === 'Claimed');
    }
    return all.filter((i) => i.type === currentFilter && i.status !== 'Claimed');
  });

  constructor() {
    addIcons({ add });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([15.65588, 121.039818], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  setFilter(event: CustomEvent): void {
    const value = event.detail.value as 'All' | 'Lost' | 'Found' | 'Claimed';
    if (value) {
      this.filter.set(value);
    }
  }

  goTo(id: string): void {
    this.router.navigate(['/item-detail', id]);
  }
}
