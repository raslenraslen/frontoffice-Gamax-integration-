import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPacksComponent } from './show-packs.component';

describe('ShowPacksComponent', () => {
  let component: ShowPacksComponent;
  let fixture: ComponentFixture<ShowPacksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowPacksComponent]
    });
    fixture = TestBed.createComponent(ShowPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
