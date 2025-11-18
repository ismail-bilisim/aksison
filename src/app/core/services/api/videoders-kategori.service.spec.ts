import { TestBed } from '@angular/core/testing';

import { VideodersKategoriService } from './videoders-kategori.service';

describe('VideodersKategoriService', () => {
  let service: VideodersKategoriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideodersKategoriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
