import { Injectable } from '@angular/core';
import { GeoCoordinates, GeoLocationProvider } from './geoloocation-provider';

@Injectable({ providedIn: 'root' })
export class BrowserGeoLocationService extends GeoLocationProvider {
  override getLocation(): Promise<GeoCoordinates> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: pos.timestamp,
          }),
        reject,
        { enableHighAccuracy: true }
      );
    });
  }
}
