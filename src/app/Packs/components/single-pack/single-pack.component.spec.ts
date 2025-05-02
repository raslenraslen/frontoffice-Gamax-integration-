import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePackComponent } from './single-pack.component';

describe('SinglePackComponent', () => {
  let component: SinglePackComponent;
  let fixture: ComponentFixture<SinglePackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinglePackComponent]
    });
    fixture = TestBed.createComponent(SinglePackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
