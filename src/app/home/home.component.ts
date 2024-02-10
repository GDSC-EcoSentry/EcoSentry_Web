import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, map, startWith, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Node } from '../shared/models/station';
import { FirestoreService } from '../shared/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  searchStationsControl = new FormControl('');

  constructor(private firestoreService: FirestoreService) {}

  //Get all stations
  allStations$ = this.firestoreService.allStations$;

  //Get all nodes
  allNodes$ = this.firestoreService.allStations$.pipe(
    switchMap(stations => {
      const nodeObservables = stations.map(station =>
        this.firestoreService.getAllNodes$(station.id)
      );
      return combineLatest(nodeObservables).pipe(
        map(nodesArray => {
          const flattenedNodes = nodesArray.reduce((acc, nodes) => {
            if (nodes && acc) {
              acc.push(...nodes);
            }
            return acc;
          }, [] as Node[]);
          return flattenedNodes;
        })
      );
    })
  );

  private selectedStationId = new BehaviorSubject<string>('');
  selectedStationId$ = this.selectedStationId.asObservable();

  //Filtering station
  stations$ = combineLatest([
    this.firestoreService.allStations$, 
    this.searchStationsControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300)
    )
  ]).pipe(
    map(([stations, searchString]) => stations.filter(s => {
      const station = (s.location + ": " + s.name).toLowerCase();
      return station.includes((searchString ?? '').toLowerCase());
    }))
  )

  //Get selected station
  selectedStation$ = combineLatest([this.firestoreService.allStations$, this.selectedStationId$]).pipe(
    map(([stations, stationId]) => {
      if (stationId) {
        return stations.find((s) => s.id === stationId) || undefined;
      } else {
        return stations.length > 0 ? stations[0] : undefined;
      }
    })
  );

  getSelectedStationId(stationId: string) {
    this.selectedStationId.next(stationId);
  }
  
}
