import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { matchFieldsValidator } from './match-fields-validator';

@Component({
  selector: 'app-register.component',
  imports: [
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterModule,
  ],
  template: ` <div class="dialog-alike" style="margin: 30vh auto 0 auto">
    <mat-card class="card-section container">
      <h2 class="header" style="text-align: center">Register</h2>
      <div class="content">
        <form [formGroup]="form">
          <mat-form-field appearance="fill">
            <mat-label>Enter email</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="email@gmail.com"
            />
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Enter password</mat-label>
            <input matInput type="password" formControlName="password" />
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Confirm password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" />
          </mat-form-field>

          <mat-checkbox formControlName="remember_me">
            Rememer me
          </mat-checkbox>
        </form>
      </div>

      <div class="actions" style="justify-content: center;">
        <button matButton="outlined" [routerLink]="['/login']">Login</button>
        <button
          matButton="filled"
          (click)="register()"
          [disabled]="form.invalid"
        >
          Register
        </button>
      </div>
    </mat-card>
  </div>`,
  styles: `

  .container{
    min-width: 300px;
    width: 15vw;
    margin: auto;
    padding: 0;
  }`,
})
export class RegisterComponent {
  private _authService = inject(AuthService);

  form = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      remember_me: new FormControl(false),
    },
    { validators: matchFieldsValidator('password', 'confirmPassword') }
  );

  register(): void {
    this._authService
      .register({
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe();
  }
}
