import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[apptopbar]' })
export class TopbarDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
