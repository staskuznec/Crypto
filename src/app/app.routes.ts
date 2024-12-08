import { Routes } from '@angular/router';
import {Routers} from './constants/routers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/watchlist',
    pathMatch: 'full'
  },
  {
    path: Routers.WATCHLIST,
    loadComponent: () => import('./components/watchlist/watchlist.component').then(m => m.WatchlistComponent)
  },
  {
    path: Routers.CONVERTER,
    loadComponent: () => import('./components/converter/converter.component').then(m => m.ConverterComponent)
  },
  {
    path: Routers.WALLET,
    loadComponent: () => import('./components/wallet/wallet.component').then(m => m.WalletComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
