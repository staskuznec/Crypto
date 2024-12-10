import { TestBed } from '@angular/core/testing';

import { WatchListSettingsService } from './watch-list-service.service';

describe('WatchListSettingsService', () => {
  let service: WatchListSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchListSettingsService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get sort column', () => {
    service.setSortColumn('price');
    expect(service.getSortColumn()).toBe('price');
  });

  it('should return default sort column if not set', () => {
    expect(service.getSortColumn()).toBe('marketCap');
  });

  it('should set and get sort direction', () => {
    service.setSortDirection('asc');
    expect(service.getSortDirection()).toBe('asc');
  });

  it('should return default sort direction if not set', () => {
    expect(service.getSortDirection()).toBe('desc');
  });

  it('should set and get refresh interval', () => {
    service.setRefreshInterval(60000);
    expect(service.getRefreshInterval()).toBe(60000);
  });

  it('should return default refresh interval if not set', () => {
    expect(service.getRefreshInterval()).toBe(0);
  });
});
