import { TestBed } from '@angular/core/testing';

import { HomestayService } from './homestay.service';

describe('HomestayService', () => {
  let service: HomestayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomestayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
