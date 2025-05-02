import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLobyComponent } from './game-loby.component';

describe('GameLobyComponent', () => {
  let component: GameLobyComponent;
  let fixture: ComponentFixture<GameLobyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameLobyComponent]
    });
    fixture = TestBed.createComponent(GameLobyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
