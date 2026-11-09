import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  IonText,
} from '@ionic/angular';
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
    IonText,
  ],
})
export class PostItemPage {
  private itemService = inject(ItemService);
  private router = inject(Router);

  type: 'Lost' | 'Found' = 'Lost';
  name = '';
  description = '';
  contact = '';
  lat = signal<number | null>(15.65588);
  lng = signal<number | null>(121.039818);
  formError = signal<string>('');

  submit(): void {
    if (!this.name.trim() || !this.contact.trim()) {
      this.formError.set('Please fill in the item name and contact details.');
      return;
    }

    this.formError.set('');
    this.itemService.addItem({
      type: this.type,
      name: this.name.trim(),
      description: this.description.trim(),
      contact: this.contact.trim(),
      lat: this.lat() ?? 15.65588,
      lng: this.lng() ?? 121.039818,
      status: 'Open',
    });

    this.router.navigate(['/home']);
  }
}
