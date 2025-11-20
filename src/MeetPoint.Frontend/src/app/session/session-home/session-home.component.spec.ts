import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHomeComponent } from './session-home.component';

describe('SessionHomeComponent', () => {
  let component: SessionHomeComponent;
  let fixture: ComponentFixture<SessionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
