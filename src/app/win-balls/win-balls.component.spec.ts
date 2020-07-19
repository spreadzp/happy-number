import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinBallsComponent } from './win-balls.component';

describe('WinBallsComponent', () => {
  let component: WinBallsComponent;
  let fixture: ComponentFixture<WinBallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinBallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinBallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
