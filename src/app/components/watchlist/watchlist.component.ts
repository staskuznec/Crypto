import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoinMarketCapService } from '../../services/coinmarketcap.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



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
    DecimalPipe
  ]
})
export class WatchlistComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = [ 'name', 'symbol', 'price', 'marketCap', 'supply'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private coinMarketCapService: CoinMarketCapService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.coinMarketCapService.cryptocurrencies$.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          // долго мучался как сделать
          // по колонок price, marketCap и supply сортировка должна выполняться по числовым значениям.
          case 'price':
            return item.quote?.USD?.price ?? 0;
          case 'marketCap':
            return item.quote?.USD?.market_cap ?? 0;
          case 'supply':
            return item.circulating_supply ?? 0;
          default:
            return item[property] ?? '';
        }
      };
      this.dataSource.sort = this.sort; // Применяем сортировку
    });
    this.coinMarketCapService.fetchCryptocurrencies();
  }


  ngAfterViewInit(): void {
    this.sort.active = 'marketCap'; // Устанавливаем колонку по которой сортируем
    this.sort.direction = 'desc'; // Устанавливаем направление сортировки
    this.dataSource.sort = this.sort; // Применяем сортировку
    this.dataSource.sort = this.sort; // Применяем сортировку
    this.cdr.detectChanges(); // Обновляем представление
  }

  // функция для фильтрации таблицы по введенному значению
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
