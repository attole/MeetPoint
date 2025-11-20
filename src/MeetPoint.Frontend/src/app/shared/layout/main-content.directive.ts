import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[appMainContent]' })
export class MainContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
