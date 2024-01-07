import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, startWith, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../dashboard/dashboard.service';
import { Node } from '../shared/models/station';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  searchStationsControl = new FormControl('');

  constructor(private dashboardService: DashboardService) {}

  allStations$ = this.dashboardService.allStations$;
  allNodes$ = this.dashboardService.allStations$.pipe(
    switchMap(stations => {
      const nodeObservables = stations.map(station =>
        this.dashboardService.getAllNodes$(station.id)
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

  stations$ = combineLatest([
    this.dashboardService.allStations$, 
    this.searchStationsControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([stations, searchString]) => stations.filter(s => s.name?.toLowerCase().includes((searchString ?? '').toLowerCase())))
  )

  selectedStation$ = combineLatest([this.dashboardService.allStations$, this.selectedStationId$]).pipe(
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
