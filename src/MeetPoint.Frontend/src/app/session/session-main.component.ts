import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../settings/user.service';
import { LayoutMainComponent } from '../shared/layout/layout-main.component';
import { MainContentDirective } from '../shared/layout/main-content.directive';
import { NavItem } from '../shared/layout/nav-item-interface';
import { LeftSidebarDirective } from '../shared/layout/sidebar/left-sidebar.directive';
import { SidebarNavIconsComponent } from '../shared/layout/sidebar/sidebar-nav-icons.component';
import { SessionHubUsersService } from './session-hub-users.service';
import { SessionHubService } from './session-hub.service';

@Component({
  selector: 'app-session-main.component',
  imports: [
    MatSidenavModule,
    LeftSidebarDirective,
    MainContentDirective,
    MatIconModule,
    MatCardModule,
    LayoutMainComponent,
    SidebarNavIconsComponent,
    RouterModule,
  ],
  template: ` <app-layout-main>
    <app-sidebar-nav-icons
      *appLeftSidebar="{ style: 'width: 6vw' }"
      [navItems]="navItems"
      [toggle]="{ position: 'start', icon: 'arrow_drop_down' }"
    />
    <ng-container *appMainContent />
  </app-layout-main>`,
  styles: ``,
})
export class SessionMainComponent {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _activeRoute = inject(ActivatedRoute);
  private _sessionHubService = inject(SessionHubService);
  private _sessionHubUsersService = inject(SessionHubUsersService);
  private _userService = inject(UserService);
  token = this._route.snapshot.paramMap.get('token');
  isOwner = false;

  constructor() {
    const user = this._userService.user();
    if (user && this.token) {
      this._sessionHubUsersService.isOwner(this.token).subscribe({
        next: (res) => {
          this.isOwner = res;
        },
        error: (err) => {
          this.isOwner = false;
        },
      });
    }
  }

  navItems: NavItem[] = [
    {
      index: 0,
      icon: 'home',
      label: 'Home',
      click: () => this.reRoute('home'),
    },
    {
      index: 1,
      icon: 'stars',
      label: 'Mode',
      click: () => this.reRoute('voting'),
    },
    {
      index: 2,
      icon: 'person',
      label: 'People',
      click: () => this.reRoute('participants'),
    },
    {
      index: 3,
      icon: 'location_on',
      label: 'Places',
      click: () => this.reRoute('places'),
    },
    {
      index: 4,
      icon: 'directions_car',
      label: 'Routing',
      click: () => this.reRoute('routes'),
    },
    {
      index: 5,
      icon: 'logout',
      label: 'Leave',
      class: this.isOwner ? 'owner' : '',
      click: () => {
        const user = this._userService.user();

        if (user) {
          if (!this.isOwner)
            this._sessionHubService.leaveSession(this.token!).subscribe();
          else this._sessionHubService.deleteSession(this.token!).subscribe();
        }
        
        this.reRoute('/home');
      },
    },
  ];

  reRoute(path: string) {
    this._router.navigate([`../${path}`], {
      relativeTo: this._activeRoute,
    });
    this._router.navigate([path]);
  }
}
