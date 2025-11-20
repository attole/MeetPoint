import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Position } from './sidenav-config-interface';

@Injectable({ providedIn: 'root' })
export class SideNavController {
  private sidenavs = new Map<Position, MatSidenav>();

  attach(position: Position, sidenav: MatSidenav) {
    this.sidenavs.set(position, sidenav);
  }

  get(position: Position) {
    return this.sidenavs.get(position);
  }

  toggle(position: Position) {
    this.sidenavs.get(position)?.toggle();
  }

  open(position: Position) {
    this.sidenavs.get(position)?.open();
  }

  close(position: Position) {
    this.sidenavs.get(position)?.close();
  }

  isOpen(position: Position) {
    return this.sidenavs.get(position)?.opened ?? false;
  }
}
