import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'post-item',
    loadComponent: () => import('./post-item/post-item.page').then((m) => m.PostItemPage),
  },
  {
    path: 'item-detail/:id',
    loadComponent: () => import('./item-detail/item-detail.page').then((m) => m.ItemDetailPage),
  },
];
