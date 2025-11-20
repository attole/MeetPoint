export interface GeoCoordinates {
  lat: number;
  lng: number;
  timestamp?: number;
}

export abstract class GeoLocationProvider {
  abstract getLocation(): Promise<GeoCoordinates>;
}
