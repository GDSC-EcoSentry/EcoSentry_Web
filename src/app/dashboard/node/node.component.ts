import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit{

  //Get station and node ID from the parameter
  stationId: string = this.activatedRoute.snapshot.paramMap.get('stationid') ?? '';
  nodeId: string = this.activatedRoute.snapshot.paramMap.get('nodeid') ?? '';

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) {}
  
  //Use firestore service to get station, node, data observables
  station$ = this.firestoreService.getStation$(this.stationId);
  node$ = this.firestoreService.getNode$(this.stationId, this.nodeId);
  
  //Get only data of a specific year
  startYear: Timestamp = Timestamp.fromDate(new Date(2023, 0, 1, 0, 0, 0));
  endYear: Timestamp = Timestamp.fromDate(new Date(2023, 11, 31, 23, 59, 59));
  data$ = this.firestoreService.getData$(this.stationId, this.nodeId, this.startYear, this.endYear);

  //Series for chart
  averageTemperature: number[] = [];
  averageHumidity: number[] = [];
  averageSoilMoisture: number[] = [];
  averageRain: number[] = [];
  averageDust: number[] = [];
  averageCO: number[] = [];

  
  ngOnInit(): void {
    this.getAverage();
  }
  
  //Get avarage values for each datum by month
  getAverage() {
    this.data$.subscribe(data => {
      const averagesByMonth = {};

      data.forEach(datum => {
        const month = (datum.date as Timestamp).toDate().getMonth();
        console.log(month);
      })
    })
  }

  //Threshold for data gauge
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
