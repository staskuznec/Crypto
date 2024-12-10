// src/app/services/watch-list-service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchListSettingsService {
  private sortColumnKey = 'sortColumn';
  private sortDirectionKey = 'sortDirection';
  private refreshIntervalKey = 'refreshInterval';

  constructor() {}

  public setSortColumn(column: string): void {
    localStorage.setItem(this.sortColumnKey, column);
  }

  public getSortColumn(): string {
    return localStorage.getItem(this.sortColumnKey) || 'marketCap';
  }

  public setSortDirection(direction: 'asc' | 'desc'| ''): void {
    localStorage.setItem(this.sortDirectionKey, direction);
  }

  public getSortDirection(): 'asc' | 'desc' {
    return (localStorage.getItem(this.sortDirectionKey) as 'asc' | 'desc' | '' ) || 'desc';
  }

  public setRefreshInterval(interval: number): void {
    localStorage.setItem(this.refreshIntervalKey, interval.toString());
  }

  public getRefreshInterval(): number {
    return parseInt(localStorage.getItem(this.refreshIntervalKey) || '0', 10);
  }
}
