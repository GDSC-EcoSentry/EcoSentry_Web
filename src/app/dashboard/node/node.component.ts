import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {

  stationId: string = this.activatedRoute.snapshot.paramMap.get('stationid') ?? '';
  nodeId: string = this.activatedRoute.snapshot.paramMap.get('nodeid') ?? '';

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) {}

  station$ = this.firestoreService.getStation$(this.stationId);
  node$ = this.firestoreService.getNode$(this.stationId, this.nodeId);

  
  tempThreshold = {
    '0': {color: 'green'},
    '35': {color: 'orange'},
    '50': {color: 'red'}
  };

  humidityThreshold = {
    '0': {color: 'red'},
    '10': {color: 'orange'},
    '20': {color: 'green'}
  };

  soilMoistThreshold = {
    '0': {color: 'red'},
    '10': {color: 'orange'},
    '20': {color: 'green'}
  };

  coThreshold = {
    '0': {color: 'green'},
    '100': {color: 'orange'},
    '300': {color: 'red'}
  };

  rainThreshold = {
    '0': {color: 'green'},
    '600': {color: 'orange'},
    '1800': {color: 'red'}
  };

  dustThreshold = {
    '0': {color: 'green'},
    '20': {color: 'orange'},
    '30': {color: 'red'}
  };
  
}
