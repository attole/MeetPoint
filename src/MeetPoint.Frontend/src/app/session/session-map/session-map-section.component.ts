import {
  Component,
  effect,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../settings/user.service';
import { SectionHeaderComponent } from '../shared/section-header.component';

export interface MapParticipant {
  id: string;
  position: { lat: number; lng: number };
  username: string;
  avatar?: string;
}

@Component({
  selector: 'app-session-map.component',
  imports: [MatIconModule, SectionHeaderComponent, GoogleMapsModule],
  template: ` <div class="container">
    <app-section-header title="Map" (onClick)="openSessionMapPage()" />
    <div class="map-container">
      <google-map
        #map
        class="map"
        [height]="'100%'"
        [width]="'100%'"
        [options]="options()!"
        >@for(marker of markers(); track marker){
        <map-marker
          class="custom-marker"
          [position]="marker.position"
          [title]="marker.title!"
          [icon]="marker.icon!"
        ></map-marker>
        }
      </google-map>
    </div>
  </div>`,
  styles: `

  :host{
      display: flex;
      width: 100%;
      height: 100%;
  }

  .container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction:column
  }

  .map-container{
    flex: 1;
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden
  }

  .map{
    flex: 1;
    display: block;
  }

      .custom-marker {
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(0,0,0,0.3);
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      user-select: none;
      overflow: hidden;
    }
    .custom-marker img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
`,
})
export class SessionMapSectionComponent {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);

  private center = signal<{ lat: number; lng: number } | null>(null);
  private zoom = signal(15);
  readonly options = signal<google.maps.MapOptions>({
    headingInteractionEnabled: true,
    disableDefaultUI: true,
    gestureHandling: 'none',
    clickableIcons: false,
    zoomControl: false,
    keyboardShortcuts: false,
    fullscreenControl: false,
  });

  private _userService = inject(UserService);
  participants = signal<MapParticipant[]>([]);

  private currentMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

  mapComponent = ViewChild('map');
  placeFilters = [];
  UserCoords = signal<{ lat: number; lng: number } | null>(null);
  markers = signal<
    {
      position: google.maps.LatLngLiteral;
      title?: string;
      icon?: google.maps.Icon | google.maps.Symbol;
    }[]
  >([]);

  constructor() {
    this.trackUserLocation(this.UserCoords);

    this.placeFilters = JSON.parse(localStorage.getItem('placeFilter')!);

    effect(() => {
      this.options.set({
        center: this.center(),
        zoom: this.zoom(),
      });
    });

    effect(() => {
      const coords = this.UserCoords();
      if (coords) {
        this.center.set(coords);
        this.markers.update((v) => [
          ...v,
          {
            position: coords,
            title: 'You are here',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4', // Google blue
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 8,
            },
          },
        ]);
      }
    });

    effect(() => {
      const filters = this.placeFilters;
      const coords = this.UserCoords();
      if (coords && filters.length > 0) {
        this.fetchNearbyPlaces(coords, filters);
      }
    });
  }

  private trackUserLocation(
    userCoords: WritableSignal<{ lat: number; lng: number } | null>
  ): void {
    if (!navigator.geolocation) {
      userCoords.set(null);
      return;
    }

    navigator.geolocation.watchPosition(
      (pos) => {
        userCoords.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => userCoords.set(null),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  }

  private async fetchNearbyPlaces(
    location: { lat: number; lng: number },
    filters: string[]
  ) {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps Places library not loaded');
      return;
    }

    const { Place, SearchNearbyRankPreference } =
      (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    const request = {
      fields: ['displayName', 'location', 'businessStatus'],
      locationRestriction: {
        center: this.center(),
        radius: 500,
      },
      includedPrimaryTypes: this.placeFilters,
      maxResultCount: 5,
      rankPreference: SearchNearbyRankPreference.POPULARITY,
      language: 'en-US',
    };

    //@ts-ignore
    const { places } = await Place.searchNearby(request);

    const serializablePlaces = places.map((p) => ({
      name: p.displayName,
      lat: p.location?.lat(),
      lng: p.location?.lng(),
      status: p.businessStatus,
    }));
    localStorage.setItem('cachedPlaces', JSON.stringify(serializablePlaces));

    if (places.length) {
      const { LatLngBounds } = (await google.maps.importLibrary(
        'core'
      )) as google.maps.CoreLibrary;
      const bounds = new LatLngBounds();

      // Loop through and get all the results.
      const marks = places.map((place) => ({
        position: { lat: place.location!.lat(), lng: place.location!.lng() },
        title: place.displayName!,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: '#34A853', // Green
          fillOpacity: 1,
          strokeWeight: 1,
          scale: 6,
        },
      }));

      this.markers.update((v) => v.concat(marks));;
    } else {
      console.log('No results');
    }
  }

  openSessionMapPage(): void {
    this._router.navigate(['../map'], {
      relativeTo: this._activatedRoute,
    });
  }
}
