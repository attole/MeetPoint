import { Directive, input, TemplateRef } from '@angular/core';
import { SideNavConfig } from './sidenav-config-interface';

@Directive({ selector: '[appRightSidebar]' })
export class RightSidebarDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}

  _rawConfig = input<Partial<SideNavConfig>>({}, { alias: 'appRightSidebar' });
  private _defaultConfig: SideNavConfig = {
    position: 'end',
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
