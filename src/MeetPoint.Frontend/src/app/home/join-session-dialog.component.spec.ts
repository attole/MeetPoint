import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinSessionDialog } from './join-session-dialog.component';

describe('JoinSessionComponent', () => {
  let component: JoinSessionDialog;
  let fixture: ComponentFixture<JoinSessionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinSessionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinSessionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
