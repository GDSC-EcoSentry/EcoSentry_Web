import { Component, Input, SimpleChanges} from '@angular/core';
import { Node, Station } from '../../models/station';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent{
  @Input() stations: Station[] | null = [];
  @Input() selectedStation: Station | null | undefined;
  @Input() nodes: Node[] | null = [];

  centerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedStation'] && this.selectedStation) {
      this.centerPosition = {
        lat: this.selectedStation.geopoint?.latitude || 0,
        lng: this.selectedStation.geopoint?.longitude || 0
      };
    }
  }

  zoom = 16;

  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    zoomControl: false,
    minZoom: 4,
  }

  nodeMarkerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };

  stationMarkerOptions: google.maps.MarkerOptions = {
    draggable: false,
    icon: 'assets/images/gateway.svg'
  };
  
  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }
  
  closeInfoWindow(infoWindow: MapInfoWindow) {
    infoWindow.close();
  }

}
