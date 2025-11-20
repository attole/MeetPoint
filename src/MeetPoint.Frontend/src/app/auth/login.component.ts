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
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login.component',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterModule,
  ],

  template: ` <div class="dialog-alike" style="margin: 30vh auto 0 auto">
    <mat-card class="card-section container">
      <h2 class="header" style="text-align: center">Login</h2>
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

          <mat-checkbox formControlName="remember_me">
            Rememer me
          </mat-checkbox>
        </form>
      </div>

      <div class="actions" style="justify-content: center;">
        <button matButton="outlined" [routerLink]="['/register']">
          New User
        </button>
        <button matButton="filled" (click)="login()" [disabled]="form.invalid">
          Login
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
export class LoginComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    remember_me: new FormControl(false),
  });

  ngOnInit() {
    if (this._authService.isAuthenticated()) this._router.navigate(['/home']);
    //this.form.patchValue({ email: 'test@gmail.com', password: 'QDrw1234.' });
  }

  login(): void {
    this._authService
      .login({
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe();
  }
}
