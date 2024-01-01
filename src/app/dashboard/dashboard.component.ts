import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, of, startWith, switchMap } from 'rxjs';
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

  selectedStation$ = this.selectedStationId$.pipe(
    switchMap((stationId) => {
      if (stationId) {
        return this.dashboardService.allStations$.pipe(
          map((stations) => stations.find((s) => s.id === stationId))
        );
      } else {
        return of(null);
      }
    })
  );

  nodes$ = combineLatest([
    this.selectedStationId$.pipe(
      switchMap((stationId) => {
        if (stationId) {
          return this.dashboardService.getAllNodes$(stationId);
        } else {
          return of(null);
        }
      })
    ),
    this.searchNodesControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([nodes, searchString]) => nodes?.filter(n => n.name?.toLowerCase().includes((searchString ?? '').toLowerCase())))
  )

  constructor(private dashboardService: DashboardService) {}

  getSelectedStationId(stationId: string) {
    this.selectedStationId.next(stationId);
  }

}
