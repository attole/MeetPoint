import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SessionHubService } from '../session/session-hub.service';

@Component({
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Join Session</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill">
          <mat-label>Insert session token</mat-label>
          <input
            matInput
            formControlName="token"
            type="text"
            maxlength="10"
            [placeholder]="tokenPlaceHolder"
          />
          <mat-hint align="end">
            {{ form.get('token')?.value?.length ?? tokenPlaceHolder.length }} /
            10
          </mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="center">
      <button matButton="filled" mat-dialog-close>Go Back</button>
      <button matButton="filled" (click)="join()" [disabled]="form.invalid">
        Join
      </button>
    </mat-dialog-actions>
  `,
  styles: ``,
})
export class JoinSessionDialog {
  private _sessionHubService = inject(SessionHubService);
  private _dialogRef = inject(MatDialogRef);
  private _router = inject(Router);

  tokenPlaceHolder: string = 'A1B2C3D4E5';
  form = new FormGroup({
    token: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    timeFrequency: new FormControl(),
  });

  get timeFrequencyControl(): FormControl {
    return this.form.get('timeFrequency') as FormControl;
  }

  join(): void {
    var token = this.form.value.token!;
    this._sessionHubService.checkSessionToken(token).subscribe((isValid) => {
      if (isValid) {
        this._sessionHubService.joinSession(token).subscribe({
          next: () => {
            this._router.navigate([`/session`, token]);
          },
          error: () => console.log('ERROR'),
        });
      }
    });

    this._dialogRef.close();
  }
}
