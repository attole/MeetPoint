import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SideNavController } from './layout/sidebar/side-nav.controller';
import { Position } from './layout/sidebar/sidenav-config-interface';

@Component({
  selector: 'app-page-header',
  imports: [MatIconModule],
  template: ` <div class="header-split">
    <h1 class="clickable" (click)="onClick()">{{ title() }}</h1>
    <div class="container clickable">
      <ng-content></ng-content>
    </div>
  </div>`,
  styles: `

  .header-split {
    margin: 0 10px 25px 10px;
  }

  .container {
    display: flex;
    gap: 0.75rem;
  }

  .clickable {
      margin: auto 0;
  }`,
})
export class PageHeaderComponent {
  private _sidenavController = inject(SideNavController);

  toggle = input<Position>();
  title = input.required<string>();

  onClick() {
    this._sidenavController.toggle(this.toggle()!);
  }
}
