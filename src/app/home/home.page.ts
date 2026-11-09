import { Component, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular';
import * as L from 'leaflet';
import { ItemService } from '../services/item';
import { ItemCardComponent } from '../components/item-card/item-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ItemCardComponent,
  ],
})
export class HomePage implements AfterViewInit {
  private itemService = inject(ItemService);
  private router = inject(Router);
  private map!: L.Map;

  items = this.itemService.items;

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

  goTo(id: string): void {
    this.router.navigate(['/item-detail', id]);
  }
}
