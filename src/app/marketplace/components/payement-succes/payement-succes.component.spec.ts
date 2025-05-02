import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementSuccesComponent } from './payement-succes.component';

describe('PayementSuccesComponent', () => {
  let component: PayementSuccesComponent;
  let fixture: ComponentFixture<PayementSuccesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayementSuccesComponent]
    });
    fixture = TestBed.createComponent(PayementSuccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
