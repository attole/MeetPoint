import { NgFor, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-session-voting',
  standalone: true,
  imports: [NgFor, NgIf, MatCardModule],
  template: `
    <mat-card class="card-section" style="margin: 10px">
      <div class="place-list" *ngIf="places().length > 0; else noResults">
        <div class="place-card" *ngFor="let place of places()">
          <div class="name">{{ place.displayName || 'Unknown Place' }}</div>
          <div class="status">
            {{ place.businessStatus || 'Status unknown' }}
          </div>
          <div class="coords">
            Lat: {{ place.location?.lat() }}, Lng:
            {{ place.location?.lng() }}
          </div>
        </div>
      </div>

      <ng-template #noResults>
        <div class="no-results">No places found.</div>
      </ng-template>
    </mat-card>
  `,
  styles: [
    `
      .place-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
      }
      .place-card {
        padding: 12px;
        border-radius: 8px;
        background: #f1f1f1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .name {
        font-weight: 600;
        font-size: 16px;
      }
      .status {
        color: #666;
        font-size: 14px;
        margin-top: 4px;
      }
      .coords {
        font-family: monospace;
        font-size: 13px;
        margin-top: 6px;
        color: #333;
      }
      .no-results {
        padding: 20px;
        text-align: center;
        color: #888;
      }
    `,
  ],
})
export class PlaceResultListComponent {
  readonly places = signal<google.maps.places.Place[]>([]);

  ngOnInit(): void {
    const raw = localStorage.getItem('cachedPlaces');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as google.maps.places.Place[];
      this.places.set(parsed);
    } catch {
      console.error('Invalid JSON in localStorage for "cachedPlaces"');
    }
  }
}
