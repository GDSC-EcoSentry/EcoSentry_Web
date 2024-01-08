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
    '0': {color: '#2d9399'},
    '30': {color: 'orange'},
    '40': {color: 'red'}
  };

  humidityThreshold = {
    '0': {color: 'red'},
    '30': {color: '#37ae83'},
    '90': {color: 'orange'}
  };

  soilMoistThreshold = {
    '0': {color: 'red'},
    '20': {color: 'orange'},
    '40': {color: '#9d4337'}
  };

  coThreshold = {
    '0': {color: '#a68b41'},
    '5': {color: 'orange'},
    '10': {color: 'red'}
  };

  rainThreshold = {
    '0': {color: '#0d6cdd'},
    '2': {color: 'orange'},
    '5': {color: 'red'}
  };

  dustThreshold = {
    '0': {color: '#574103'},
    '20': {color: 'orange'},
    '30': {color: 'red'}
  };
  
}
