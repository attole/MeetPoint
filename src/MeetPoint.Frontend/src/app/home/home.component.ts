import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { LayoutMainComponent } from '../shared/layout/layout-main.component';
import { MainContentDirective } from '../shared/layout/main-content.directive';
import { CreateSessionDialog } from './create-session-dialog.component';
import { JoinSessionDialog } from './join-session-dialog.component';

interface TileConfig {
  span: number;
  title: string;
  desc?: string;
  onClick: () => void;
}

@Component({
  selector: 'app-home.component',
  standalone: true,
  imports: [
    LayoutMainComponent,
    MainContentDirective,
    MatCardModule,
    MatGridListModule,
  ],
  template: ` <app-layout-main>
    <mat-grid-list *appMainContent [cols]="totalCols()" rowHeight="25vh">
      @for (tile of tileConfigs(); track tile) {
      <mat-grid-tile [colspan]="tile.span" (click)="tile.onClick()">
        <mat-card class="card-section" style="margin: 10px">
          <mat-card-content>
            <mat-card-title>
              <h2>{{ tile.title }}</h2>
            </mat-card-title>
            <mat-card-subtitle> {{ tile.desc }} </mat-card-subtitle>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      }
    </mat-grid-list>
  </app-layout-main>`,
  styles: `

    .mat-grid-list{
      width: 80vw;
      margin:  30vh auto;
    }

    .mat-grid-tile{
      transition: transform 0.5s ease;
      &:hover {
        transform: scale(1.05);
      }
    }

    .mat-mdc-card-content{
      margin-top: auto;
      min-height: 40%;
      justify-content: flex-end
    }
    `,
})
export class HomeComponent {
  private _dialog = inject(MatDialog);
  private _router = inject(Router);

  tiles = signal<TileConfig[]>([
    {
      span: 6,
      title: 'Create session',
      desc: 'Create session as an owner',
      onClick: () =>
        this._dialog.open(CreateSessionDialog, {
          width: '300px',
          panelClass: 'dialog',
          autoFocus: 'dialog',
        }),
    },
    {
      span: 6,
      title: 'Join session',
      desc: 'Join existing session as a participant',
      onClick: () =>
        this._dialog.open(JoinSessionDialog, {
          width: '300px',
          panelClass: 'dialog',
          autoFocus: 'dialog',
        }),
    },
    {
      span: 3,
      title: 'Settings',
      onClick: () => this._router.navigate(['/settings']),
    },
  ]);

  totalCols = computed(() =>
    this.tiles().reduce((sum, tile) => sum + tile.span, 0)
  );

  tileConfigs = computed(() => {
    let offset = 0;
    return this.tiles().map((tile) => {
      const result = { ...tile, offset };
      offset += tile.span;
      return result;
    });
  });
}
