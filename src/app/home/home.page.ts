import type { OnInit, AfterViewInit } from '@angular/core';
import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
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
  IonSpinner,
  IonButton,
  IonSearchbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add,
  layersOutline,
  searchOutline,
  giftOutline,
  checkmarkCircleOutline,
  mapOutline,
  listOutline,
} from 'ionicons/icons';
import * as L from 'leaflet';

import { ItemCardComponent } from '../components/item-card/item-card.component';
import { ItemService } from '../services/item';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
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
    IonSpinner,
    IonButton,
    IonSearchbar,
    ItemCardComponent,
  ],
})
export class HomePage implements OnInit, AfterViewInit {
  private itemService = inject(ItemService);
  private router = inject(Router);
  private map!: L.Map;

  items = this.itemService.items;
  loading = this.itemService.loading;
  error = this.itemService.error;
  filter = signal<'All' | 'Lost' | 'Found' | 'Claimed'>('All');
  searchQuery = signal<string>('');
  showMap = signal<boolean>(false);

  totalCount = computed(() => this.items().length);
  lostCount = computed(() => this.items().filter((i) => i.type === 'Lost' && i.status === 'Open').length);
  foundCount = computed(() => this.items().filter((i) => i.type === 'Found' && i.status === 'Open').length);
  claimedCount = computed(() => this.items().filter((i) => i.status === 'Claimed').length);

  filtered = computed(() => {
    const currentFilter = this.filter();
    const query = this.searchQuery().toLowerCase();
    let result = this.items();

    if (currentFilter === 'Claimed') {
      result = result.filter((i) => i.status === 'Claimed');
    } else if (currentFilter !== 'All') {
      result = result.filter((i) => i.type === currentFilter && i.status !== 'Claimed');
    }

    if (query) {
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.contact.toLowerCase().includes(query),
      );
    }

    return result;
  });

  constructor() {
    addIcons({
      add,
      'layers-outline': layersOutline,
      'search-outline': searchOutline,
      'gift-outline': giftOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'map-outline': mapOutline,
      'list-outline': listOutline,
    });
  }

  ngOnInit(): void {
    this.itemService.fetchItems();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([15.44825, 120.93922], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  toggleMap(): void {
    this.showMap.update((v) => !v);
    if (this.showMap()) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }

  retry(): void {
    this.itemService.fetchItems();
  }

  setFilter(event: CustomEvent): void {
    const value = event.detail.value as 'All' | 'Lost' | 'Found' | 'Claimed';
    if (value) {
      this.filter.set(value);
    }
  }

  onSearch(event: CustomEvent): void {
    const val = (event.detail?.value as string) || '';
    this.searchQuery.set(val.trim());
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  setFilterValue(category: 'All' | 'Lost' | 'Found' | 'Claimed'): void {
    this.filter.set(category);
    try {
      Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      void e;
    }
  }

  goTo(id: string): void {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.router.navigate(['/item-detail', id]);
  }

  goToPost(): void {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.router.navigate(['/post-item']);
  }
}
