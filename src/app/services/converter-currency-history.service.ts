import { Injectable } from '@angular/core';
import { CryptoHistory } from '../interfaces/crypto';

@Injectable({
  providedIn: 'root'
})
export class ConverterCurrencyHistoryService {
  private readonly FROM_CURRENCY_KEY = 'fromCurrencyHistory';
  private readonly TO_CURRENCY_KEY = 'toCurrencyHistory';

  constructor() { }

  public addFromCurrency(currency: string, logo: string): void {
    const history = this.getFromCurrencyHistory();
    const existing = history.find(item => item.currency === currency);
    if (existing) {
      existing.count += 1;
    } else {
      history.push({ currency, logo, count: 1 });
    }
    localStorage.setItem(this.FROM_CURRENCY_KEY, JSON.stringify(history));
  }

  public addToCurrency(currency: string, logo: string): void {
    const history = this.getToCurrencyHistory();
    const existing = history.find(item => item.currency === currency);
    if (existing) {
      existing.count += 1;
    } else {
      history.push({ currency, logo, count: 1 });
    }
    localStorage.setItem(this.TO_CURRENCY_KEY, JSON.stringify(history));
  }

  public getFromCurrencyHistory(): CryptoHistory[] {
    const history = localStorage.getItem(this.FROM_CURRENCY_KEY);
    return history ? JSON.parse(history) : [];
  }

  public getToCurrencyHistory(): CryptoHistory[] {
    const history = localStorage.getItem(this.TO_CURRENCY_KEY);
    return history ? JSON.parse(history) : [];
  }

  public getTopFromCurrencies(): CryptoHistory[] {
    return this.getFromCurrencyHistory()
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  public getTopToCurrencies(): CryptoHistory[] {
    return this.getToCurrencyHistory()
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
