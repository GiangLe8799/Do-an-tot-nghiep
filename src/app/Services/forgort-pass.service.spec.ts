import { TestBed } from '@angular/core/testing';

import { ForgortPassService } from './forgort-pass.service';

describe('ForgortPassService', () => {
  let service: ForgortPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgortPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
