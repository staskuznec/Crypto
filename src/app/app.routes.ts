import { Routes } from '@angular/router';
import {WatchlistComponent} from './components/watchlist/watchlist.component';
import {ConverterComponent} from './components/converter/converter.component';
import {WalletComponent} from './components/wallet/wallet.component';

export const routes: Routes = [
  { path: '', redirectTo: '/watchlist', pathMatch: 'full' },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'converter', component: ConverterComponent },
  { path: 'wallet', component: WalletComponent },
];
