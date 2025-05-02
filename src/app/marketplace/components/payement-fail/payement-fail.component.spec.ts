import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementFailComponent } from './payement-fail.component';

describe('PayementFailComponent', () => {
  let component: PayementFailComponent;
  let fixture: ComponentFixture<PayementFailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayementFailComponent]
    });
    fixture = TestBed.createComponent(PayementFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
