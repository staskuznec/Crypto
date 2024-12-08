import { TestBed } from '@angular/core/testing';

import { WatchListServiceService } from './watch-list-service.service';

describe('WatchListServiceService', () => {
  let service: WatchListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
