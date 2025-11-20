import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionMainComponent } from './session-main.component';

describe('SessionNavComponent', () => {
  let component: SessionMainComponent;
  let fixture: ComponentFixture<SessionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
