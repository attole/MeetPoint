import { CommonModule } from '@angular/common';
import { Component, contentChild, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MainContentDirective } from './main-content.directive';
import { LeftSidebarDirective } from './sidebar/left-sidebar.directive';
import { RightSidebarDirective } from './sidebar/right-sidebar.directive';
import { SideNavController } from './sidebar/side-nav.controller';
import { NavTopComponent } from './top/nav-top.component';
import { TopbarDirective } from './top/topbar.directive';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    NavTopComponent,
  ],
  template: `
    <ng-container
      [ngTemplateOutlet]="topNavBar()?.templateRef || defaultTopBar"
    />
    <mat-sidenav-container style="height: 100%">
      @if(leftSideBar()){
      <mat-sidenav
        #leftSidenav
        [mode]="leftSideBar()?.config?.mode!"
        [opened]="leftSideBar()?.config?.toggle!"
        [position]="leftSideBar()?.config?.position!"
        [style]="leftSideBar()?.config?.style"
      >
        <ng-container [ngTemplateOutlet]="leftSideBar()?.templateRef" />
      </mat-sidenav>
      } @if(rightSideBar()){
      <mat-sidenav
        #rightSidenav
        [mode]="rightSideBar()?.config?.mode!"
        [opened]="rightSideBar()?.config?.toggle!"
        [position]="rightSideBar()?.config?.position!"
        [style]="rightSideBar()?.config?.style"
      >
        <ng-container [ngTemplateOutlet]="rightSideBar()?.templateRef" />
      </mat-sidenav>
      }
      <mat-sidenav-content
        style="padding: 0 2vw;display: flex; flex-direction: column"
      >
        <ng-component [ngTemplateOutlet]="mainContent().templateRef" />
      </mat-sidenav-content>
    </mat-sidenav-container>

    <ng-template #defaultTopBar><app-nav-top /> </ng-template>
  `,
  styles: `

  :host {
  display: flex;
  flex-direction: column;
  height: 100%;
}
`,
})
export class LayoutMainComponent {
  @ViewChild('leftSidenav') leftSidenav?: MatSidenav;
  @ViewChild('rightSidenav') rightSidenav?: MatSidenav;

  topNavBar = contentChild(TopbarDirective);
  rightSideBar = contentChild(RightSidebarDirective);
  leftSideBar = contentChild(LeftSidebarDirective);
  mainContent = contentChild.required(MainContentDirective);

  private _sideNavController = inject(SideNavController);

  ngAfterViewInit() {
    if (this.leftSideBar() != undefined)
      this._sideNavController.attach('start', this.leftSidenav!);
    if (this.rightSideBar() != undefined)
      this._sideNavController.attach('end', this.rightSidenav!);
  }
}
