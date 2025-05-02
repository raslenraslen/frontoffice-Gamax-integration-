import { TestBed } from '@angular/core/testing';

import { LostpasswordService } from './lostpassword.service';

describe('LostpasswordService', () => {
  let service: LostpasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LostpasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
