import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { environment } from '../../environments/environment';
import { Item, NewItem } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  items = signal<Item[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');

  fetchItems(): void {
    this.loading.set(true);
    this.error.set('');
    this.http.get<Item[]>(this.url).subscribe({
      next: (res) => {
        this.items.set([...res].reverse());
        this.loading.set(false);
      },
      error: async (err) => {
        console.error('GET Error:', err);
        this.error.set('Could not load items. Check your internet connection.');
        this.loading.set(false);
        try {
          await Haptics.notification({ type: NotificationType.Error });
        } catch {}
      },
    });
  }

  addItem(newItem: NewItem): Observable<Item> {
    return this.http.post<Item>(this.url, newItem);
  }

  markClaimed(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.url}/${item.id}`, {
      ...item,
      status: 'Claimed',
    });
  }

  getById(id: string): Item | undefined {
    return this.items().find((i) => i.id === id);
  }

  saveLocalPhoto(id: string, dataUrl: string): void {
    try {
      localStorage.setItem(`findit_photo_${id}`, dataUrl);
    } catch {}
  }

  getPhoto(item: Item): string | undefined {
    try {
      const local = localStorage.getItem(`findit_photo_${item.id}`);
      if (local) {
        return local;
      }
    } catch {}
    return item.photo;
  }
}
