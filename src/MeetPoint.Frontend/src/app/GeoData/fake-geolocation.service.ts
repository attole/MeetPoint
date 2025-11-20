import { Injectable } from '@angular/core';
import { GeoCoordinates, GeoLocationProvider } from './geoloocation-provider';

@Injectable({ providedIn: 'root' })
export class FakeGeoLocationService extends GeoLocationProvider {
  private index = 0;
  private script: GeoCoordinates[] = [
    { lat: 50.45, lng: 30.52 },
    { lat: 50.46, lng: 30.53 },
    { lat: 50.47, lng: 30.54 },
  ];

  override getLocation(): Promise<GeoCoordinates> {
    const location = this.script[this.index++ % this.script.length];
    return Promise.resolve({ ...location, timestamp: Date.now() });
  }
}
