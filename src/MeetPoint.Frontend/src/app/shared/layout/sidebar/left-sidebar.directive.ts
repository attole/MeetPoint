import { Directive, input, TemplateRef } from '@angular/core';
import { SideNavConfig } from './sidenav-config-interface';

@Directive({ selector: '[appLeftSidebar]', standalone: true })
export class LeftSidebarDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}

  _rawConfig = input<Partial<SideNavConfig>>({}, { alias: 'appLeftSidebar' });
  private _defaultConfig: SideNavConfig = {
    position: 'start',
    mode: 'side',
    toggle: 'open',
  };

  get config(): SideNavConfig {
    return {
      ...this._defaultConfig,
      ...this._rawConfig(),
    };
  }
}
