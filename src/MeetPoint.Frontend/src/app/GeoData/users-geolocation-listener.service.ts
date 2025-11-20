import { inject, Injectable, signal } from '@angular/core';
import { SessionHubConnectionService } from '../session/session-hub-connection';
import { MapParticipant } from '../session/session-map/session-map-section.component';
import { UserService } from '../settings/user.service';

export type UserGeoData = {
  userId: string;
  geoJsonList: string[];
};

export interface UserTrackPolyline {
  userId: string;
  polyline: google.maps.LatLngLiteral[];
}

@Injectable({
  providedIn: 'root',
})
export class GeoDataSignalRService {
  private _userService = inject(UserService);
  private _connectionService = inject(SessionHubConnectionService);
  public geoData = signal<UserGeoData[]>([]);

  participants = signal<MapParticipant[]>([]);
  polylines = signal<UserTrackPolyline[]>([]);

  constructor() {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this._connectionService
      .on<[string, string[]][]>('ReceiveGeoDataList')
      .subscribe((data) => {
        const parsed: UserGeoData[] = data.map(([userId, geoJsonList]) => ({
          userId,
          geoJsonList,
        }));

        this.geoData.set(parsed);

        const { participants, polylines } = this.parseUserGeoData(
          parsed,
          (userId) => {
            return {
              username: '',
              avatar: undefined,
            };
          }
        );
        this.participants.set(participants);
        this.polylines.set(polylines);
      });
  }

  private parseUserGeoData(
    data: UserGeoData[],
    getUserMeta: (userId: string) => { username: string; avatar?: string }
  ): { participants: MapParticipant[]; polylines: UserTrackPolyline[] } {
    const participants: MapParticipant[] = [];
    const polylines: UserTrackPolyline[] = [];

    for (const user of data) {
      const coords: { lat: number; lng: number; timestamp: string }[] = [];

      for (const json of user.geoJsonList) {
        try {
          const parsed = JSON.parse(json);
          if ('lat' in parsed && 'lng' in parsed && 'timestamp' in parsed) {
            coords.push(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse coordinate JSON:', json);
        }
      }

      if (coords.length === 0) continue;

      const last = coords[coords.length - 1];
      const meta = getUserMeta(user.userId);

      participants.push({
        id: user.userId,
        position: { lat: last.lat, lng: last.lng },
        username: meta.username,
        avatar: meta.avatar,
      });

      polylines.push({
        userId: user.userId,
        polyline: coords.map(({ lat, lng }) => ({ lat, lng })),
      });
    }

    return { participants, polylines };
  }
}
