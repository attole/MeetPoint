import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionMapSectionComponent } from './session-map-section.component';

describe('SessionMapComponent', () => {
  let component: SessionMapSectionComponent;
  let fixture: ComponentFixture<SessionMapSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionMapSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionMapSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
