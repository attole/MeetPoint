import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-section-header',
  imports: [MatIconModule],
  template: ` <div class="header-split">
    <div class="container">
      <h3 class="clickable" (click)="onClick.emit()">{{ title() }}</h3>
      <mat-icon class="clickable" (click)="onClick.emit()">
        arrow_forward
      </mat-icon>
    </div>
    <mat-icon class="clickable"> list </mat-icon>
  </div>`,
  styles: `

  .container {
    display: flex;
    gap: 0.75rem;
  }

  .header-split {
    padding-bottom: 10px;
  }

  mat-icon.clickable {
      margin: auto 0;
  }`,
})
export class SectionHeaderComponent {
  title = input.required<string>();
  onClick = output();
}
