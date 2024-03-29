import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, take } from 'rxjs';
import { Data } from 'src/app/shared/models/station';
import { DangerDetectService } from 'src/app/shared/services/danger-detect.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@UntilDestroy()
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit{

  //Get station and node ID from the parameter
  stationId: string = this.activatedRoute.snapshot.paramMap.get('stationid') ?? '';
  nodeId: string = this.activatedRoute.snapshot.paramMap.get('nodeid') ?? '';

  constructor(
    private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService,
    private dangerDetectService: DangerDetectService
  ) {}
  
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
    '70': {color: 'orange'},
    '150': {color: 'red'}
  };

  rainThreshold = {
    '0': {color: '#0d6cdd'},
    '50': {color: 'orange'},
    '70': {color: 'red'}
  };

  dustThreshold = {
    '0': {color: '#574103'},
    '35': {color: 'orange'},
    '50': {color: 'red'}
  };

  //Use firestore service to get station, node, data observables
  station$ = this.firestoreService.getStation$(this.stationId).pipe(take(1));
  node$ = this.firestoreService.getNode$(this.stationId, this.nodeId).pipe(
    map(node => {
      if(node) {
        node.danger = this.dangerDetectService.getDanger(node);
      }
      return node;
    }),
    untilDestroyed(this)
  );
  
  //Get only data of a specific year
  selectedYear: number = 2023;
  yearList: number[] = [];
  data$ = this.firestoreService.getData$(this.stationId, this.nodeId, this.getStartDate(this.selectedYear), this.getEndDate(this.selectedYear));

  //Series for chart
  averageTemperature: (number | null)[] = new Array(12).fill(null);
  averageHumidity: (number | null)[] = new Array(12).fill(null);
  averageSoilMoisture: (number | null)[] = new Array(12).fill(null);
  averageRain: (number | null)[] = new Array(12).fill(null);
  averageDust: (number | null)[] = new Array(12).fill(null);
  averageCO: (number | null)[] = new Array(12).fill(null);
  
  ngOnInit(): void {
    this.getYearList();
    this.getAverage();
  }
  
  //Get list of year from 2023 to current year
  getYearList() {
    for(let year = 2023; year <= new Date().getFullYear(); year++) {
      this.yearList.push(year);
    }
  }

  //Get avarage values for each datum by month
  //Take 1 prevents the chart from updating in real-time
  getAverage() {
    this.data$.pipe(take(1)).subscribe(data => {
      const dataByMonth: any = {};

      //Empty data so that it can be populate correctly again
      this.emptyData();

      data.forEach(datum => {
        const month = (datum.date as Timestamp).toDate().getMonth();
        //Initialize data for a month
        if (!dataByMonth[month]) {
          dataByMonth[month] = [];
        }

        //Insert data based on a specific month
        dataByMonth[month].push(datum);

        //Loop over the month which is key and calculate the averages
        Object.keys(dataByMonth).forEach(monthKey => {
          const month = Number(monthKey);
          const monthData = dataByMonth[month];
          const avgTemperature = parseFloat((monthData.reduce((sum: number, item: Data) => sum + item.temperature, 0) / monthData.length).toFixed(2));
          const avgHumidity = parseFloat((monthData.reduce((sum: number, item: Data) => sum + item.humidity, 0) / monthData.length).toFixed(2));
          const avgSoilMoisture = parseFloat((monthData.reduce((sum: number, item: Data) => sum + item.soil_moisture, 0) / monthData.length).toFixed(2));
          const avgRain = parseFloat((monthData.reduce((sum: number, item: Data) => sum + item.rain, 0) / monthData.length).toFixed(2));
          const avgDust = parseFloat((monthData.reduce((sum: number, item: Data) => sum + item.dust, 0) / monthData.length).toFixed(2));
          const avgCO = parseFloat((monthData.reduce((sum: number, item: Data) => sum + item.co, 0) / monthData.length).toFixed(2));

          //Populate the series
          this.averageTemperature[month] = avgTemperature;
          this.averageHumidity[month] = avgHumidity;
          this.averageSoilMoisture[month] = avgSoilMoisture;
          this.averageRain[month] = avgRain;
          this.averageDust[month] = avgDust;
          this.averageCO[month] = avgCO;
        })
      })
    })
  }

  getSelectedYear(year: number) {
    this.selectedYear = year;
    this.data$ = this.firestoreService.getData$(this.stationId, this.nodeId, this.getStartDate(this.selectedYear), this.getEndDate(this.selectedYear));
    this.getAverage();
  }

  //Empty the series
  emptyData() {
    this.averageTemperature = [];
    this.averageHumidity = [];
    this.averageSoilMoisture = [];
    this.averageRain = [];
    this.averageDust = [];
    this.averageCO = [];
  }

  getStartDate(year: number) {
    const startDate = Timestamp.fromDate(new Date(year, 0, 1, 0, 0, 0));
    return startDate;
  }

  getEndDate(year: number) {
    const endDate = Timestamp.fromDate(new Date(year, 11, 31, 23, 59, 59));
    return endDate;
  }
}
