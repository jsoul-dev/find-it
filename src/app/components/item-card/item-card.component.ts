import { Component, input, output, inject } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge } from '@ionic/angular';

import type { Item } from '../../models/item';
import { ItemService } from '../../services/item';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge],
})
export class ItemCardComponent {
  private itemService = inject(ItemService);

  item = input.required<Item>();
  open = output<string>();

  get photoUrl(): string | undefined {
    return this.itemService.getPhoto(this.item());
  }

  onSelect(): void {
    this.open.emit(this.item().id);
  }
}
