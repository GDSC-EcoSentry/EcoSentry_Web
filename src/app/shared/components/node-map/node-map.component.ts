import { Component, Input, OnInit } from '@angular/core';
import { Node, Station } from '../../models/station';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-node-map',
  templateUrl: './node-map.component.html',
  styleUrls: ['./node-map.component.scss']
})
export class NodeMapComponent implements OnInit{
  @Input() node!: Node;
  @Input() station!: Station;
  
  nodePosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 }
  stationPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 }

  ngOnInit(): void {
    this.nodePosition = { lat: this.node.geopoint.latitude, lng: this.node.geopoint.longitude }
    this.stationPosition = { lat: this.station.geopoint.latitude, lng: this.station.geopoint.longitude }
  }
  zoom = 15;

  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    zoomControl: false,
    minZoom: 12,
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

}
