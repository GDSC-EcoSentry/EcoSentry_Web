import { Component, Input, OnInit } from '@angular/core';
import { Node, Station } from '../../models/station';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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

  //Map size
  mapSize: string = "100%";

  //Change map size based on screen size
  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(untilDestroyed(this))
    .subscribe(result => {
      if(result.matches) {
        this.mapSize = "45vh"
      }
      else {
        this.mapSize = "100%"
      }
    });
  }

  ngOnInit(): void {
    this.nodePosition = { lat: this.node.geopoint.latitude, lng: this.node.geopoint.longitude }
    this.stationPosition = { lat: this.station.geopoint.latitude, lng: this.station.geopoint.longitude }
  }
  zoom = 15;

  //Setting map options
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

  closeInfoWindow(infoWindow: MapInfoWindow) {
    infoWindow.close();
  }

}
