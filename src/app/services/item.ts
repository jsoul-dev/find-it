import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Haptics, NotificationType } from '@capacitor/haptics';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import type { Item, NewItem } from '../models/item';

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
        } catch (e) {
          void e;
        }
      },
    });
  }

  addItem(newItem: NewItem): Observable<Item> {
    return this.http.post<Item>(this.url, newItem);
  }

  uploadImage(dataUrl: string): Observable<string> {
    const cleanBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const formData = new FormData();
    formData.append('image', cleanBase64);

    return this.http
      .post<{ data: { url: string }; success: boolean }>(
        `${environment.imgbbUrl}?key=${environment.imgbbApiKey}`,
        formData,
      )
      .pipe(map((res) => res.data.url));
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
    } catch (e) {
      void e;
    }
  }

  getPhoto(item: Item): string | undefined {
    try {
      const local = localStorage.getItem(`findit_photo_${item.id}`);
      if (local) {
        return local;
      }
    } catch (e) {
      void e;
    }
    return item.photo;
  }
}
