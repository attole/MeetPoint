import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { NavItem } from '../nav-item-interface';
import { SideNavController } from './side-nav.controller';
import { Position } from './sidenav-config-interface';

@Component({
  selector: 'app-sidebar-nav-icons',
  standalone: true,
  imports: [MatSidenavModule, RouterModule, MatIconModule],
  template: `
    <div class="nav-list">
      @if(toggle()){
      <a class="item clickable" (click)="onClick()">
        <div class="nav-icon-label">
          <mat-icon> {{ toggle()?.icon }}</mat-icon>
        </div>
      </a>
      } @for (item of navItems(); track item) {
      <a
        [class]="'item clickable ' + item.class || ''"
        (click)="item.click()"
        routerLinkActive="active-link"
      >
        <div class="nav-icon-label">
          <mat-icon> {{ item.icon }}</mat-icon>
          @if(item.label){
          <label class="small clickable" style="padding-top: 5px">
            {{ item.label }}
          </label>
          }
        </div>
      </a>
      }
    </div>
  `,
  styles: `

  .nav-list{
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }

  .owner {
    background-color: red !important;
  }

  .item {
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 25%;
      transition: background-color 0.3s ease;
      cursor: pointer;
      user-select: none;
      background-color: transparent;
      padding: 4px;
  }

  .item.active-link {
    pointer-events: none;
    opacity: 0.8;
  }

  .item:hover:not(.active-link){
    background-color: var(--mat-sys-surface-container-low);
  }

  .active-link{
    background-color: var(--mat-sys-surface-container-low);
  }

  .nav-icon-label{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;
    margin: auto;
  }
  `,
})
export class SidebarNavIconsComponent {
  private _sidenavController = inject(SideNavController);

  toggle = input<{ position: Position; icon: string }>();
  navItems = input<NavItem[]>([]);

  onClick() {
    this._sidenavController.toggle(this.toggle()?.position!);
  }
}
