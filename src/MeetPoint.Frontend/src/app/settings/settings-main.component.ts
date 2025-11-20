import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LayoutMainComponent } from '../shared/layout/layout-main.component';
import { MainContentDirective } from '../shared/layout/main-content.directive';
import { LeftSidebarDirective } from '../shared/layout/sidebar/left-sidebar.directive';
import { SidebarNavIconsComponent } from '../shared/layout/sidebar/sidebar-nav-icons.component';
import { PageHeaderComponent } from '../shared/page-header.component';
import { UserService } from './user.service';

export interface Settings {
  email: string;
  username: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-settings.component',
  standalone: true,
  imports: [
    LayoutMainComponent,
    LeftSidebarDirective,
    MatSidenavModule,
    MainContentDirective,
    SidebarNavIconsComponent,
    RouterModule,
    PageHeaderComponent,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  template: ` <app-layout-main>
    <app-sidebar-nav-icons *appLeftSidebar="{ style: 'width: 6vw' }" />
    <ng-container *appMainContent>
      <app-page-header title="Settings" />
      <mat-card class="card-section" style="height: 60%">
        <form [formGroup]="form" style="height: 100%">
          <div class="grid">
            <mat-form-field class="grid-item larger-form" appearance="fill">
              <mat-label>Change email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="email@gmail.com"
              />
            </mat-form-field>

            <mat-form-field class="grid-item larger-form" appearance="fill">
              <mat-label>Change username</mat-label>
              <input matInput type="text" formControlName="username" />
            </mat-form-field>

            <mat-form-field class="grid-item larger-form" appearance="fill">
              <mat-label>Change phonenumber</mat-label>
              <input
                matInput
                type="text"
                formControlName="phoneNumber"
                placeholder="123456789"
                maxlength="15"
                minlength="9"
              />
            </mat-form-field>

            <div style="height: 60%; width: 60%; margin: auto">
              <img
                class="profile-pic"
                [src]="image() ?? user()?.profileImageUrl"
                (click)="fileInput.click()"
                style="cursor: pointer"
              />
            </div>

            <input
              type="file"
              #fileInput
              hidden
              (change)="onFileSelected($event)"
            />

            <ng-container formGroupName="password">
              <mat-form-field class="grid-item larger-form" appearance="fill">
                <mat-label>Enter current password</mat-label>
                <input matInput type="password" formControlName="current" />
              </mat-form-field>

              <mat-form-field class="grid-item larger-form" appearance="fill">
                <mat-label>Enter new password</mat-label>
                <input matInput type="password" formControlName="new" />
              </mat-form-field>
            </ng-container>

            <div class="container">
              <button
                class="grid-button larger-form"
                matButton="filled"
                (click)="save()"
              >
                Save
              </button>

              <button
                class="grid-button larger-form"
                matButton="filled"
                (click)="authService.logout()"
              >
                Log out
              </button>
            </div>
          </div>
        </form>
      </mat-card>
    </ng-container>
  </app-layout-main>`,
  styles: `

  .mat-mdc-text-field-wrapper {
    height: 100% !important;
  }

    .grid{
      height: 100%;
      margin: auto;
      display: grid;
      grid-auto-rows: 1fr;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .grid-item {
      width: 60%;
      height: 50%;
      margin: auto;
      display: flex;
      flex-direction: column;
    }

    .container {
      display: flex;
      flex-direction: column;
      margin-bottom: 5%;
      justify-content: center;
      align-items: center;
      gap: 10%
    }

    .grid-button {
      width: 40%;
      height: 20%;
    }

    .mat-mdc-floating-label {
      font-size: 1.25rem !important;
    }

  .larger-form {
    font-size: 1.25rem;

    .mat-mdc-floating-label{
      font-size: 1.25rem;
    }

    .mat-mdc-form-field-label {
      font-size: 1.25rem;
    }

    .grid-button {
      font-size: 1.25rem;
      padding: 0.75em 1.5em;
    }
  }
  `,
})
export class SettingsMainComponent {
  private _initialData?: Settings = undefined;
  authService = inject(AuthService);
  private _userService = inject(UserService);
  user = computed(() => this._userService.user());
  file = signal<File | null>(null);
  image = computed(() => {
    if (this.file()) return URL.createObjectURL(this.file()!);
    return null;
  });

  form = new FormGroup(
    {
      email: new FormControl('', [Validators.email]),
      username: new FormControl(''),
      phoneNumber: new FormControl('', [
        Validators.pattern(/^\+?[0-9]{10,15}$/),
        Validators.minLength(10),
        Validators.maxLength(15),
      ]),
      password: new FormGroup({
        current: new FormControl('', [Validators.minLength(6)]),
        new: new FormControl<string | null>('', [Validators.minLength(6)]),
      }),
    },
    { asyncValidators: [this.passwordCheckValidation()] }
  );

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        this._initialData = {
          email: user.email,
          username: user.username!,
          phoneNumber: user.phoneNumber,
        };
        this.form.patchValue(user);
      }
    });
  }

  passwordCheckValidation(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value.password?.new || !control.value.password?.current)
        return of(null);

      return this._userService
        .checkPassword(control.value.password?.current)
        .pipe(
          map(() => null),
          catchError((error) => of({ Error: error }))
        );
    };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.file.set(input.files[0]);
  }

  save() {
    const updatedData: Settings = {
      email: this.form.value.email!,
      username: this.form.value.username!,
      phoneNumber: this.form.value.phoneNumber!,
    };

    if (!this.hasChanges(updatedData) && this.file() == null) return;

    this._userService
      .setUserDataAndReload(
        {
          userName: updatedData.username!,
          phoneNumber: updatedData.phoneNumber!,
        },
        this.file()
      )
      .subscribe({
        next: () => {
          this._initialData = {
            email: updatedData.email!,
            username: updatedData.username!,
            phoneNumber: updatedData.phoneNumber!,
          };
        },
        error: (err) => console.error('Update error', err),
      });
  }

  hasChanges(updated: any): boolean {
    return JSON.stringify(updated) !== JSON.stringify(this._initialData);
  }
}
