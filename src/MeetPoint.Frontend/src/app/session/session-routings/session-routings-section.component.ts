import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeaderComponent } from '../shared/section-header.component';

@Component({
  selector: 'app-session-routings.component',
  imports: [MatIconModule, SectionHeaderComponent],
  template: `<div style="height: 100%; width: 100%">
    <app-section-header title="Routes" (onClick)="openSessionRoutesPage()" />
    <div class="grid">
      @for (route of [1, 2, 3, 4]; track route){
      <img src="/files/route{{ route }}.png" />
      }
    </div>
  </div>`,
  styles: `

  :host{
    display: block;
    width: 100%;
    height: 100%;
  }

  .grid {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(2, 1fr);

    img {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 0.5rem;
      }
  }
`,
})
export class SessionRoutingsSectionComponent {}
