import { Component, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatIconModule } from '@angular/material/icon';
import { SectionHeaderComponent } from './shared/section-header.component';

export interface MapParticipant {
  id: string;
  position: { lat: number; lng: number };
  username: string;
  avatar?: string;
}

@Component({
  selector: 'test',
  imports: [MatIconModule, SectionHeaderComponent, GoogleMapsModule],
  template: ` <div class="container">
    <app-section-header title="Map" />
    <div class="map-container">
      <google-map
        #map
        class="map"
        [center]="{ lat: 50.524440999999996, lng: 30.226197599999995 }"
        [zoom]="17"
      >
        <map-polyline [path]="this.verticles()!" />
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
    margin: 100px;
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
export class AAAA {
  verticles = signal<google.maps.LatLng[] | null>(null);


  async aaa() {
    const { DirectionsService, DirectionsRenderer } =
      (await google.maps.importLibrary('routes')) as google.maps.RoutesLibrary;

    const directionsService = new google.maps.DirectionsService();

    const response = await directionsService.route({
      origin: { lat: 50.5243859, lng: 30.226947 }, // Kyiv
      destination: { lat: 50.528560999999996, lng: 30.230058000000003 }, // Lviv
      travelMode: google.maps.TravelMode.DRIVING,
    });

    const polyline = response.routes[0].overview_polyline;
    const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
    this.verticles.set(decodedPath);
  }
}
