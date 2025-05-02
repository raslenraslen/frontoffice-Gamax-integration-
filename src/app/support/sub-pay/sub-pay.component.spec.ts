import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPayComponent } from './sub-pay.component';

describe('SubPayComponent', () => {
  let component: SubPayComponent;
  let fixture: ComponentFixture<SubPayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubPayComponent]
    });
    fixture = TestBed.createComponent(SubPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
