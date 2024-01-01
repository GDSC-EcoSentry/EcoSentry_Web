import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, of, startWith, switchMap, take } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  searchStationsControl = new FormControl('');
  searchNodesControl = new FormControl('');

  chances = [
    {name: 'High', value: 'High'},
    {name: 'Medium', value: 'Medium'},
    {name: 'Low', value: 'Low'},
  ];

  private selectedStationId = new BehaviorSubject<string>('');
  selectedStationId$ = this.selectedStationId.asObservable();

  stations$ = combineLatest([
    this.dashboardService.allStations$, 
    this.searchStationsControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([stations, searchString]) => stations.filter(s => s.name?.toLowerCase().includes((searchString ?? '').toLowerCase())))
  )

  selectedStation$ = combineLatest([this.dashboardService.allStations$, this.selectedStationId$]).pipe(
    map(([stations, stationId]) => {
      if (stationId) {
        return stations.find((s) => s.id === stationId);
      } else {
        return stations.length > 0 ? stations[0] : null;
      }
    })
  );

  // ...

nodes$ = combineLatest([
  this.selectedStation$.pipe(
    switchMap((station) => {
      if (station) {
        return this.dashboardService.getAllNodes$(station.id);
      } else {
        return of([]);
        }
      })
    ),
    this.searchNodesControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([nodes, searchString]) => nodes?.filter(n => n.name?.toLowerCase().includes((searchString ?? '').toLowerCase())))
  );

  nodesWithLatestData$ = combineLatest([this.nodes$, this.selectedStation$]).pipe(
    switchMap(([nodes, station]) => {
      if (!station) {
        return of([]);
      }

      const latestDataObservables = (nodes || []).map((node) => {
        return this.dashboardService.getLatestData$(station.id, node.id).pipe(
          map((latestData) => ({ ...node, latestData }))
        );
      });
  
      return combineLatest(latestDataObservables);
    })
  );

  constructor(private dashboardService: DashboardService) {}

  getSelectedStationId(stationId: string) {
    this.selectedStationId.next(stationId);
  }

}
