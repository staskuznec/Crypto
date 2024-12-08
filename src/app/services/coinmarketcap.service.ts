import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, map, Observable, Subject, takeUntil, tap} from 'rxjs';
import {Crypto} from '../interfaces/crypto';

@Injectable({
  providedIn: 'root'
})
export class CoinMarketCapService implements OnDestroy{
  private apiUrl = '/api/v1';
  private apiKey = process.env['COINMARKETCAP_API_KEY'] ;

  private cryptocurrenciesSubject = new BehaviorSubject<Crypto[]>([]);
  public cryptocurrencies$ = this.cryptocurrenciesSubject.asObservable();
  private destroyed$: Subject<void> = new Subject();

  constructor(private http: HttpClient) {}
  fetchCryptocurrencies(): void {
    if (!this.apiKey) {
      throw new Error('API key is not defined');
    }
    this.http.get<any>(`${this.apiUrl}/cryptocurrency/listings/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': this.apiKey,
      }
    }).pipe(
      map(data => data.data),
      tap(cryptos => {
        const symbols = cryptos.map((crypto: any) => crypto.symbol);
        this.fetchCryptocurrencyInfo(symbols).pipe(
          takeUntil(this.destroyed$)
        ).subscribe(info => {
          const enrichedCryptos = cryptos.map((crypto: any) => ({
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            price: crypto.quote.USD.price,
            marketCap: crypto.quote.USD.market_cap,
            supply: crypto.circulating_supply,
            logo: info[crypto.symbol].logo
          }));
          this.cryptocurrenciesSubject.next(enrichedCryptos);
        });
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  private fetchCryptocurrencyInfo(symbols: string[]): Observable<any> {
    if (!this.apiKey) {
      throw new Error('API key is not defined');
    }
    const symbolsParam = symbols.join(',');
    return this.http.get<any>(`${this.apiUrl}/cryptocurrency/info?symbol=${symbolsParam}`, {

      headers: {
        'X-CMC_PRO_API_KEY': this.apiKey,
      }
    }).pipe(
      map(response => response.data),
      takeUntil(this.destroyed$)
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
