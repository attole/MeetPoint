import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { SessionHubService } from '../session/session-hub.service';
import { PlaceTypes } from '../shared/Places/PlaceTypes';

export interface sessionSettings {
  placeFilter: string[];
  allow_others_to_propose_places: boolean;
}

@Component({
  selector: 'app-create-session-dialog.component',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    CommonModule,
  ],
  template: `
    <h2 mat-dialog-title>Create Session</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" style="margin-bottom: 20px">
          <mat-label>Change session token</mat-label>
          <input
            id="token"
            matInput
            formControlName="token"
            type="text"
            maxlength="10"
            [placeholder]="tokenPlaceHolder"
          />
          <mat-hint align="start"> Can be empty </mat-hint>
          <mat-hint align="end">
            {{ form.get('token')?.value?.length ?? tokenPlaceHolder.length }} /
            10
          </mat-hint>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Add place filters</mat-label>
          <mat-select formControlName="placeFilter" multiple>
            @for (pair of allplacefilterOptions; track pair) {
            <mat-option [value]="pair[0]">
              {{ pair[1] }}
            </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-checkbox formControlName="allow_others_to_propose_places">
          Allow other participants to propose places
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="center">
      <button matButton="filled" mat-dialog-close>Go Back</button>
      <button matButton="filled" (click)="create()" [disabled]="form.invalid">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: ``,
})
export class CreateSessionDialog {
  private _dialogRef = inject(MatDialogRef);
  private _sessionHubService = inject(SessionHubService);
  private _router = inject(Router);

  tokenPlaceHolder: string = '';
  allplacefilterOptions = Object.entries(PlaceTypes);
  placeFilterOptions: string[] = this.allplacefilterOptions
    .map((pair) => pair[0])
    .slice(0, 4);

  form = new FormGroup({
    token: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    timeFrequency: new FormControl(),
    placeFilter: new FormControl<string[]>([]),
    allow_others_to_propose_places: new FormControl(false),
  });

  async ngOnInit() {
    this._sessionHubService.generateSessionToken().subscribe((token) => {
      this.form.patchValue({
        token: token,
        placeFilter: this.placeFilterOptions,
      });
      this.tokenPlaceHolder = token;
    });
  }

  create(): void {
    const token = this.form.value.token!;

    if (token != this.tokenPlaceHolder) {
      this._sessionHubService.checkSessionToken(token).subscribe((isValid) => {
        if (!isValid) this.form.patchValue({ token: this.tokenPlaceHolder });
      });
    }

    const settings: sessionSettings = {
      placeFilter: this.form.value.placeFilter || [],
      allow_others_to_propose_places:
        this.form.value.allow_others_to_propose_places!,
    };

    this._sessionHubService
      .createSession(token, 'standart', settings)
      .subscribe();

    localStorage.setItem(
      'placeFilter',
      JSON.stringify(this.placeFilterOptions)
    );

    this._dialogRef.close();
    this._router.navigate([`/session`, this.form.value.token]);
  }
}

export interface PlaceTypes {
  id: number;
  name: string;
}
