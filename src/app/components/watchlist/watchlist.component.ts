import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoinMarketCapService } from '../../services/coinmarketcap.service';
import {CurrencyPipe, DecimalPipe, NgForOf} from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {Subject, takeUntil, interval} from 'rxjs';
import {MatOption, MatSelect} from '@angular/material/select';
import {WatchListSettingsService} from '../../services/watch-list-service.service';
import {Crypto} from '../../interfaces/crypto';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe,
    DecimalPipe,
    MatSelect,
    MatOption,
    NgForOf
  ]
})
export class WatchlistComponent implements OnInit,AfterViewInit, OnDestroy {
  displayedColumns: string[] = [ 'name', 'symbol', 'price', 'marketCap', 'supply'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  refreshInterval: number = 0;
  refreshIntervals = [
    { value: 0, label: 'Off' },
    { value: 60000, label: '1 minute' },
    { value: 300000, label: '5 minutes' },
    { value: 600000, label: '10 minutes' },
    { value: 1800000, label: '30 minutes' },
    { value: 3600000, label: '1 hour' }
  ];
  // создаем Subject для отписки от стрима
  private destroyed$: Subject<void> = new Subject();
  // создаем Subject для отписки интервала
  private intervalDestroyed$: Subject<void> = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private coinMarketCapService: CoinMarketCapService,
    private cdr: ChangeDetectorRef,
    private wls: WatchListSettingsService) {
  }

  ngOnInit(): void {
    this.coinMarketCapService.cryptocurrencies$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: Crypto, property: string): string | number   => {
        switch (property) {
          // долго мучался как сделать
          // по колонок price, marketCap и supply сортировка должна выполняться по числовым значениям.
          case 'price':
            return item.price ?? 0;
          case 'marketCap':
            return item.marketCap ?? 0;
          case 'supply':
            return item.supply ?? 0;
          case 'name':
            return item.name ?? '';
          case 'symbol':
            return item.symbol ?? '';
          default:
            return  '';
        }
      };
      this.dataSource.sort = this.sort; // Применяем сортировку
    });
    this.coinMarketCapService.fetchCryptocurrencies();

  }

  ngAfterViewInit(): void {
    //this.sort.direction = 'desc'; // Устанавливаем направление сортировки
    // загружаем настройки из сервиса
    this.sort.active = this.wls.getSortColumn();
    this.sort.direction = this.wls.getSortDirection() as 'asc' | 'desc'| '';
    this.refreshInterval = this.wls.getRefreshInterval();
    this.onIntervalChange(this.refreshInterval);
    //this.dataSource.sort = this.sort; // Применяем сортировку
    this.sort.sortChange.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.wls.setSortColumn(this.sort.active);
      this.wls.setSortDirection(this.sort.direction as 'asc' | 'desc' | '');
    });
    this.cdr.detectChanges(); // Обновляем представление
  }

  // функция для обновления данных
  public onIntervalChange(refreshValue: number): void {
    this.refreshInterval = refreshValue;
    this.wls.setRefreshInterval(refreshValue); // Сохраняем настройки в сервисе
    this.intervalDestroyed$.next(); // Завершаем текущий интервал если он есть, а то интервалы будут накапливаться
    if (refreshValue >0) {
      interval(refreshValue).pipe(
        takeUntil(this.intervalDestroyed$),
        takeUntil(this.destroyed$)
      ).subscribe(() => this.loadData());
    }
  }

 // функция для загрузки данных из сервиса
  loadData(): void {
    this.coinMarketCapService.fetchCryptocurrencies();
  }

  // функция для фильтрации таблицы по введенному значению
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.intervalDestroyed$.next();
    this.intervalDestroyed$.complete();
  }
}
