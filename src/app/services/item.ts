import { Injectable, signal } from '@angular/core';
import { Item, NewItem } from '../models/item';

const SEED_ITEMS: Item[] = [
  {
    id: '1',
    type: 'Lost',
    name: 'Black umbrella',
    description: 'Left near the library entrance after class.',
    contact: '0917-000-0001',
    lat: 15.6561,
    lng: 121.0399,
    status: 'Open',
    createdAt: '2026-11-05T08:15:00.000Z',
  },
  {
    id: '2',
    type: 'Found',
    name: 'Student ID with blue lace',
    description: 'Found on a canteen table. Turned in at the guard house.',
    contact: 'Guard house',
    lat: 15.6554,
    lng: 121.0392,
    status: 'Open',
    createdAt: '2026-11-06T10:30:00.000Z',
  },
  {
    id: '3',
    type: 'Lost',
    name: 'Blue tumbler',
    description: 'Last seen in Room 204 after the afternoon class.',
    contact: 'fb.com/example',
    lat: 15.6559,
    lng: 121.0405,
    status: 'Claimed',
    createdAt: '2026-11-07T13:45:00.000Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  items = signal<Item[]>(SEED_ITEMS);
  loading = signal<boolean>(false);
  error = signal<string>('');

  fetchItems(): void {
    this.loading.set(false);
    this.error.set('');
  }

  addItem(newItem: NewItem): void {
    const item: Item = {
      ...newItem,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    this.items.update((list) => [item, ...list]);
  }

  markClaimed(item: Item): void {
    this.items.update((list) =>
      list.map((i) => (i.id === item.id ? { ...i, status: 'Claimed' } : i))
    );
  }

  getById(id: string): Item | undefined {
    return this.items().find((i) => i.id === id);
  }
}
