import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../settings/user.service';
import { SectionHeaderComponent } from '../shared/section-header.component';

export interface Participant {
  id: string;
  username: string;
  avatar?: string;
}

@Component({
  selector: 'app-session-participants-section.component',
  imports: [MatIconModule, SectionHeaderComponent],
  template: ` <div #container style="height: 100%; width: 100%">
    <app-section-header
      title="Participants"
      (onClick)="openSessionParticipantPage()"
    />
    <div
      class="people-grid"
      [style.grid-template-columns]="'repeat(' + columnsCount() + ', 1fr)'"
    >
      @for (participant of participants(); track participant){
      <div class="person-container" (click)="openSessionParticipantPage()">
        <img
          class="profile-pic"
          [src]="participant.avatar ?? '/files/default.png'"
        />
        <label>{{ participant.username }}</label>
      </div>
      }
    </div>
  </div>`,
  styles: `

  .people-grid{
    display: grid;
    max-width: 100%;
    max-height: 100%;
    gap: 5%;
  }

  .person-container{
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      aspect-ratio: 1 / 1;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: transform 0.5s ease;
  }

  .person-container:hover{
    transform: scale(1.05);
  }

  :host{
      display: block;
      width: 100%;
      height: 100%;
  }`,
})
export class SessionParticipantsSectionComponent {
  private _router = inject(Router);
  private _containerRef = viewChild<ElementRef>('container');
  private _userService = inject(UserService);
  private _activatedRoute = inject(ActivatedRoute);

  participants = signal<Participant[]>([]);
  columnsCount = signal(4);

  constructor() {
    effect(() => {
      const me = this._userService.user();
      this.participants.set([
        {
          id: me?.id!,
          username: me?.username!,
          avatar: me?.profileImageUrl,
        },
      ]);
    });
  }

  ngAfterViewInit(): void {
    this.updateLayout();
    new ResizeObserver(() => this.updateLayout()).observe(
      this._containerRef()!.nativeElement
    );
  }

  updateLayout() {
    const container = this._containerRef()!.nativeElement as HTMLElement;
    const containerAspectRatio = container.clientWidth / container.clientHeight;
    const count = 8; //this.participants().length;

    if (Number.isNaN(containerAspectRatio)) {
      setTimeout(() => this.updateLayout(), 100);
      return;
    }

    let columns = (() => {
      switch (true) {
        case Math.abs(containerAspectRatio - 1) < 0.25:
          return Math.ceil(Math.sqrt(count));
        case containerAspectRatio < 1:
          return Math.ceil(count / 2);
        default:
          return Math.ceil(count / 2);
      }
    })();

    this.columnsCount.set(columns);
  }

  openSessionParticipantPage(): void {
    this._router.navigate(['../participants'], {
      relativeTo: this._activatedRoute,
    });
  }
}
