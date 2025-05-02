import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSubComponent } from './payment-sub.component';

describe('PaymentSubComponent', () => {
  let component: PaymentSubComponent;
  let fixture: ComponentFixture<PaymentSubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSubComponent]
    });
    fixture = TestBed.createComponent(PaymentSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
