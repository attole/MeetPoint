import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRoutingsSectionComponent } from './session-routings-section.component';

describe('SessionRoutingsComponent', () => {
  let component: SessionRoutingsSectionComponent;
  let fixture: ComponentFixture<SessionRoutingsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionRoutingsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionRoutingsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
