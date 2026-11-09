import type { OnInit, AfterViewInit } from '@angular/core';
import { Component, inject, signal, computed } from '@angular/core';
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
  IonSpinner,
  IonButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import * as L from 'leaflet';

import { ItemCardComponent } from '../components/item-card/item-card.component';
import { ItemService } from '../services/item';

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
    IonSpinner,
    IonButton,
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

  retry(): void {
    this.itemService.fetchItems();
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
