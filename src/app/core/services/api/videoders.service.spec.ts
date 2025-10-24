import { TestBed } from '@angular/core/testing';

import { VideodersService } from './videoders.service';

describe('VideodersService', () => {
  let service: VideodersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideodersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
