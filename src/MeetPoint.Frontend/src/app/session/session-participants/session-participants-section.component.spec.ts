import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionParticipantsSectionComponent } from './session-participants-section.component';

describe('SessionParticipantsComponent', () => {
  let component: SessionParticipantsSectionComponent;
  let fixture: ComponentFixture<SessionParticipantsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionParticipantsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionParticipantsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
