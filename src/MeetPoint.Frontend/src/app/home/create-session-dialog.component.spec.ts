import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionDialog } from './create-session-dialog.component';

describe('CreateSessionComponent', () => {
  let component: CreateSessionDialog;
  let fixture: ComponentFixture<CreateSessionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSessionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSessionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
