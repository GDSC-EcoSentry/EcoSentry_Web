import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, take } from 'rxjs';
import { Data } from 'src/app/shared/models/station';
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
    '50': {color: 'orange'},
    '100': {color: 'red'}
  };

  rainThreshold = {
    '0': {color: '#0d6cdd'},
    '2': {color: 'orange'},
    '5': {color: 'red'}
  };

  dustThreshold = {
    '0': {color: '#574103'},
    '50': {color: 'orange'},
    '100': {color: 'red'}
  };

  //Use firestore service to get station, node, data observables
  station$ = this.firestoreService.getStation$(this.stationId).pipe(take(1));
  node$ = this.firestoreService.getNode$(this.stationId, this.nodeId).pipe(
    map(node => {
      if(node) {
        node.danger = this.getDanger(node.temperature, node.humidity, node.soil_moisture, node.rain, node.dust, node.co);
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
          const avgTemperature = monthData.reduce((sum: number, item: Data) => sum + item.temperature, 0) / monthData.length;
          const avgHumidity = monthData.reduce((sum: number, item: Data) => sum + item.humidity, 0) / monthData.length;
          const avgSoilMoisture = monthData.reduce((sum: number, item: Data) => sum + item.soil_moisture, 0) / monthData.length;
          const avgRain = monthData.reduce((sum: number, item: Data) => sum + item.rain, 0) / monthData.length;
          const avgDust = monthData.reduce((sum: number, item: Data) => sum + item.dust, 0) / monthData.length;
          const avgCO = monthData.reduce((sum: number, item: Data) => sum + item.co, 0) / monthData.length;

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

  //WARNING LEVELS
  levels = ['Low', 'Medium', 'High'];

  //Thresholds for warning
  tempWarning = {
    '0': 'Low',
    '40': 'Medium',
    '50': 'High'
  };

  coWarning = {
    '0': 'Low',
    '50': 'Medium',
    '100': 'High'
  };

  rainWarning = {
    '0': 'Low',
    '2': 'Medium',
    '5': 'High'
  };

  dustWarning = {
    '0': 'Low',
    '50': 'Medium',
    '100': 'High'
  };

  //Get danger level based on the thresholds
  getDangerLevel(value: number, thresholds: { [key: string]: string }): string {
    let highestLevel = 'Low'; // Default to 'Low' if no threshold is met
    for (const threshold in thresholds) {
      if (value >= parseInt(threshold) && this.levels.indexOf(thresholds[threshold]) > this.levels.indexOf(highestLevel) ) {
          highestLevel = thresholds[threshold];
      }
    }
    return highestLevel; 
  }

  //Get the level of danger for the node
  getDanger(temp: number, humid: number, soil: number, rain: number, dust: number, co: number) {
    const tempLevel = this.getDangerLevel(temp, this.tempWarning);
    const coLevel = this.getDangerLevel(co, this.coWarning);
    const rainLevel = this.getDangerLevel(rain, this.rainWarning);
    const dustLevel = this.getDangerLevel(dust, this.dustWarning);
    const humidLevel = humid >= 0 && humid <= 30 ? 'High' : humid >= 30 && humid <= 90 ? 'Low' : 'Medium';
    const soilLevel = soil >= 0 && soil <= 20 ? 'High' : humid >= 20 && humid <= 40 ? 'Medium' : 'Low';

    // You can customize the logic here to determine the overall danger level based on individual levels
    // For this example, we'll simply return the highest danger level among all factors
    console.log([tempLevel, humidLevel, soilLevel, coLevel, rainLevel, dustLevel]);
    
    return [tempLevel, humidLevel, soilLevel, coLevel, rainLevel, dustLevel]
    .reduce((a, b) => (this.levels.indexOf(a) > this.levels.indexOf(b) ? a : b));
  }
}
