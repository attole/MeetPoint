import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UIStateService } from './uistate-service';

@Component({
  selector: 'app-nav-top',
  imports: [MatIconModule],
  template: ` <div class="top-panel">
    <mat-icon
      class="clickable"
      [class.disabled]="!UIStateService.canGoBack"
      (click)="UIStateService.goBack()"
    >
      arrow_back
    </mat-icon>
    <mat-icon class="clickable" (click)="UIStateService.toggleTheme()">
      {{ UIStateService.isDarkTheme ? 'light_mode' : 'dark_mode' }}
    </mat-icon>
  </div>`,
  styles: `

  .top-panel {
    height: 8vh;
    display: flex;
    justify-content: space-between;
    margin: 0 2vw;
    align-items: center;
  }

  .clickable.disabled {
    pointer-events: none;
    opacity: 0.3;
    cursor: default;
  }

  `,
})
export class NavTopComponent {
  UIStateService = inject(UIStateService);
}
