import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GeoCoordinates, GeoLocationProvider } from './geoloocation-provider';

@Injectable({ providedIn: 'root' })
export class GeoStreamService {
  private _http = inject(HttpClient);
  private readonly interval$ = timer(0, 5000);
  private readonly sub = new Subscription();

  constructor(private geo: GeoLocationProvider) {}

  startSending(): void {
    this.sub.add(
      this.interval$.subscribe(() => {
        this.geo.getLocation().then((pos) => {
          this._http.post<GeoCoordinates>('/api/geo', pos).subscribe();
        });
      })
    );
  }

  stop(): void {
    this.sub.unsubscribe();
  }
}
