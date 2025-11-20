import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-auto-resize-grid',
  imports: [CommonModule],
  template: `
    <div
      #container
      class="grid-container"
      [style.grid-template-columns]="'repeat(' + columnsCount() + ', 1fr)'"
    >
      <div
        class="grid-item"
        *ngFor="let item of items(); let i = index"
        (click)="itemClicked.emit(item)"
      >
        <ng-template
          [ngTemplateOutlet]="itemTemplate()"
          [ngTemplateOutletContext]="{ $implicit: item, index: i }"
        ></ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .grid-container {
        display: grid;
        width: 100%;
        height: 100%;
        gap: 1rem;
        box-sizing: border-box;
      }
      .grid-item {
        aspect-ratio: 1 / 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
        cursor: pointer;
      }
      .grid-item:hover {
        transform: scale(1.05);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoResizeGridComponent<T> implements AfterViewInit {
  readonly items = input<T[]>([]);
  readonly itemTemplate = input.required<TemplateRef<any>>();
  @Output() itemClicked = new EventEmitter<T>();

  @ViewChild('container', { static: true })
  private containerRef!: ElementRef<HTMLElement>;

  columnsCount = signal(4);

  ngAfterViewInit() {
    this.updateLayout();
    new ResizeObserver(() => this.updateLayout()).observe(
      this.containerRef.nativeElement
    );
  }

  private updateLayout() {
    const container = this.containerRef.nativeElement;
    const containerAspectRatio = container.clientWidth / container.clientHeight;
    const count = this.items().length;

    let columns: number;

    if (Math.abs(containerAspectRatio - 1) < 0.25) {
      columns = Math.ceil(Math.sqrt(count));
    } else if (containerAspectRatio < 1) {
      columns = Math.ceil(count / 2);
    } else {
      columns = Math.ceil(count / 2);
    }

    this.columnsCount.set(columns);
  }
}
