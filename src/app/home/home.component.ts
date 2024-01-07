import { Component } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { Station } from '../shared/models/station';
import { FormControl } from '@angular/forms';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  searchStationsControl = new FormControl('');

  constructor(private dashboardService: DashboardService) {}

  allStations$ = this.dashboardService.allStations$;

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
