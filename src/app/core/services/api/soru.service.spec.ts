import { TestBed } from '@angular/core/testing';

import { SoruService } from './soru.service';

describe('SoruService', () => {
  let service: SoruService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoruService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
