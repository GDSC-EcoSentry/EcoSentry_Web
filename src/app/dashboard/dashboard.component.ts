import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, map, of, startWith, switchMap, take, tap } from 'rxjs';
import { NodeParams } from '../shared/models/nodeParams';
import { FirestoreService } from '../shared/services/firestore.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
  searchStationsControl = new FormControl('');
  sortControl = new FormControl('');
  totalCount = 0;

  sorts = [
    {name: 'Name', value: 'name'},
    {name: 'Temperature', value: 'temperature'},
    {name: 'Humidity', value: 'humidity'},
    {name: 'Smoke', value: 'smoke'},
  ];

  nodeParams = new NodeParams;

  //Selected station observable
  private selectedStationId = new BehaviorSubject<string>('');
  selectedStationId$ = this.selectedStationId.asObservable();
  //Page change observable
  private pageChanged = new BehaviorSubject<number>(1);
  pageChanged$ = this.pageChanged.asObservable();
  //Sort order observable
  private orderChanged = new BehaviorSubject<string>('asc');
  orderChanged$ = this.orderChanged.asObservable();

  /*Realtime station filtering, suggested station only
   show up after user has stopped typing for 300ms*/
  stations$ = combineLatest([
    this.firestoreService.allStations$, 
    this.searchStationsControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300))
  ]).pipe(
    map(([stations, searchString]) => stations.filter(s => {
      const station = (s.location + ": " + s.name).toLowerCase();
      return station.includes((searchString ?? '').toLowerCase());
    })),
    untilDestroyed(this)
  )

  /*Get the selected station, if none was selected, 
  select the first station in the list by default*/
  selectedStation$ = combineLatest([this.firestoreService.allStations$, this.selectedStationId$]).pipe(
    map(([stations, stationId]) => {
      if (stationId) {
        return stations.find((s) => s.id === stationId) || null;
      } else {
        return stations.length > 0 ? stations[0] : null;
      }
    }),
    untilDestroyed(this)
  );

  allNodes$ = this.selectedStation$.pipe(
    switchMap((station) => {
      if(station) {
        return this.firestoreService.getAllNodes$(station.id).pipe(
          map((nodes) => {
            this.totalCount = nodes?.length ?? 0;
            return nodes;
          })
        );
      }
      return of(null);
    }),
    untilDestroyed(this)
  );

  //Realtime paging, sorting
  filteredNodes$ = combineLatest([
      //All of the value changes that will trigger this observable
      this.selectedStation$,
      this.pageChanged$.pipe(startWith(1)),
      this.sortControl.valueChanges.pipe(
        tap(() => this.onPageChanged(1)),
        startWith('name')
      ),
      this.orderChanged$.pipe(
        tap(() => this.onPageChanged(1)),
        startWith('asc')
      )
    ]).pipe(
      switchMap(([station, page, sort, sortOrder]) => {
        this.nodeParams.stationId = station ? station.id : '';
        this.nodeParams.sort = sort ? sort : '';
        this.nodeParams.sortOrder = sortOrder ? sortOrder : '';
        this.nodeParams.pageNumber = page;
        
        //Get the filtered nodes.
        return this.firestoreService.getFilteredNodes$(this.nodeParams).pipe( //Apply danger level to each node
          map(nodes => {
            return nodes?.map(node => {
              node.danger = this.getDanger(node.temperature, node.humidity, node.soil_moisture, node.rain, node.dust, node.co);
              return node;
            });
          })
        );
      }),
      untilDestroyed(this)
    );

  constructor(private firestoreService: FirestoreService) {}

  getSelectedStationId(stationId: string) {
    this.selectedStationId.next(stationId);
  }

  onPageChanged(event: any) {
    if(this.nodeParams.pageNumber !== event){
      this.nodeParams.pageNumber = event;
      this.pageChanged.next(event);
    }
  }

  onOrderChanged() {
    if(this.orderChanged.getValue() === 'asc') {
      this.orderChanged.next('desc');
    }
    else this.orderChanged.next('asc');
  }

  //WARNING LEVELS
  levels = ['Low', 'Medium', 'High'];

  //Thresholds for each reading
  tempThreshold = {
    '0': 'Low',
    '40': 'Medium',
    '50': 'High'
  };

  coThreshold = {
    '0': 'Low',
    '50': 'Medium',
    '100': 'High'
  };

  rainThreshold = {
    '0': 'Low',
    '2': 'Medium',
    '5': 'High'
  };

  dustThreshold = {
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
    const tempLevel = this.getDangerLevel(temp, this.tempThreshold);
    const coLevel = this.getDangerLevel(co, this.coThreshold);
    const rainLevel = this.getDangerLevel(rain, this.rainThreshold);
    const dustLevel = this.getDangerLevel(dust, this.dustThreshold);
    const humidLevel = humid >= 0 && humid <= 30 ? 'High' : humid >= 30 && humid <= 90 ? 'Low' : 'Medium';
    const soilLevel = soil >= 0 && soil <= 20 ? 'High' : humid >= 20 && humid <= 40 ? 'Medium' : 'Low';

    // You can customize the logic here to determine the overall danger level based on individual levels
    // For this example, we'll simply return the highest danger level among all factors
    console.log([tempLevel, humidLevel, soilLevel, coLevel, rainLevel, dustLevel]);
    
    return [tempLevel, humidLevel, soilLevel, coLevel, rainLevel, dustLevel]
    .reduce((a, b) => (this.levels.indexOf(a) > this.levels.indexOf(b) ? a : b));
  }
}
