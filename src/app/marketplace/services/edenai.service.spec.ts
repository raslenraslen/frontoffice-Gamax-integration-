import { TestBed } from '@angular/core/testing';

import { EdenaiService } from './edenai.service';

describe('EdenaiService', () => {
  let service: EdenaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdenaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
