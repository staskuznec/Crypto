// src/app/services/watch-list-service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchListServiceService {
  private sortColumnKey = 'sortColumn';
  private sortDirectionKey = 'sortDirection';
  private refreshIntervalKey = 'refreshInterval';

  constructor() {}

  setSortColumn(column: string): void {
    localStorage.setItem(this.sortColumnKey, column);
  }

  getSortColumn(): string {
    return localStorage.getItem(this.sortColumnKey) || 'marketCap';
  }

  setSortDirection(direction: 'asc' | 'desc'| ''): void {
    localStorage.setItem(this.sortDirectionKey, direction);
  }

  getSortDirection(): 'asc' | 'desc' {
    return (localStorage.getItem(this.sortDirectionKey) as 'asc' | 'desc' | '' ) || 'desc';
  }

  setRefreshInterval(interval: number): void {
    localStorage.setItem(this.refreshIntervalKey, interval.toString());
  }

  getRefreshInterval(): number {
    return parseInt(localStorage.getItem(this.refreshIntervalKey) || '0', 10);
  }
}
