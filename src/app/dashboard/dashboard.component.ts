import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { Node } from '../shared/models/station';
import { NodeParams } from '../shared/models/nodeParams';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
  searchStationsControl = new FormControl('');
  sortControl = new FormControl('');
  sortOrderControl = new FormControl('');
  totalCount = 0;

  sorts = [
    {name: 'Name', value: 'name'},
    {name: 'Temperature', value: 'temperature'},
    {name: 'Humidity', value: 'humidity'},
    {name: 'Smoke', value: 'smoke'},
  ];

  sortOrders = [
    {name: 'Ascending', value: 'asc'},
    {name: 'Descending', value: 'desc'},
  ];

  nodeParams = new NodeParams;

  private selectedStationId = new BehaviorSubject<string>('');
  selectedStationId$ = this.selectedStationId.asObservable();

  private pageChanged = new BehaviorSubject<number>(1);
  pageChanged$ = this.pageChanged.asObservable();

  stations$ = combineLatest([
    this.dashboardService.allStations$, 
    this.searchStationsControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([stations, searchString]) => stations.filter(s => s.name?.toLowerCase().includes((searchString ?? '').toLowerCase())))
  )

  selectedStation$ = combineLatest([this.dashboardService.allStations$, this.selectedStationId$]).pipe(
    map(([stations, stationId]) => {
      if (stationId) {
        return stations.find((s) => s.id === stationId) || null;
      } else {
        return stations.length > 0 ? stations[0] : null;
      }
    })
  );

  allNodes$ = this.selectedStation$.pipe(
    switchMap((station) => {
      if(station) {
        return this.dashboardService.getAllNodes$(station.id).pipe(
          map((nodes) => {
            this.totalCount = nodes?.length ?? 0;
            return nodes;
          })
        );
      }
      return of(null);
    })
  );

  filteredNodes$ = combineLatest([
      //All of the value changes that will trigger this observable
      this.selectedStation$,
      this.pageChanged$.pipe(startWith(1)),
      this.sortControl.valueChanges.pipe(startWith('name')).pipe(
        tap(() => this.onPageChanged(1)),
        startWith('')
      ),
      this.sortOrderControl.valueChanges.pipe(startWith('asc')).pipe(
        tap(() => this.onPageChanged(1)),
        startWith('')
      )
    ]).pipe(
      switchMap(([station, page, sort, sortOrder]) => {
        this.nodeParams.stationId = station ? station.id : '';
        this.nodeParams.sort = sort ? sort : '';
        this.nodeParams.sortOrder = sortOrder ? sortOrder : '';
        this.nodeParams.pageNumber = page;
        
        //Get the filtered nodes and update the latest data to it.
        return this.dashboardService.getFilteredNodes$(this.nodeParams).pipe(
          switchMap((nodes) => {
            const latestDataObservables = (nodes || []).map((node) => {
              return this.dashboardService.getLatestData$(this.nodeParams.stationId, node.id).pipe(
                map((latestData) => ({ ...node, ...latestData }))
              );
            });
        
            return combineLatest(latestDataObservables) as Observable<Node[]>;
          })
        );
      })
    );

  constructor(private dashboardService: DashboardService) {}

  getSelectedStationId(stationId: string) {
    this.selectedStationId.next(stationId);
  }

  onPageChanged(event: any){
    if(this.nodeParams.pageNumber !== event){
      this.nodeParams.pageNumber = event;
      this.pageChanged.next(event);
    }
  }
}
