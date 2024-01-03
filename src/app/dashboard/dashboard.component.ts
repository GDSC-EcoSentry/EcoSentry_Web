import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, from, map, of, startWith, switchMap, take, tap } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { Node } from '../shared/models/station';
import { NodeParams } from '../shared/models/nodeParams';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  searchStationsControl = new FormControl('');
  searchNodesControl = new FormControl('');
  searchChanceControl = new FormControl('');
  sortControl = new FormControl('');
  sortOrderControl = new FormControl('');
  totalCount = 0;

  chances = [
    {name: 'High', value: 'High'},
    {name: 'Medium', value: 'Medium'},
    {name: 'Low', value: 'Low'},
  ];

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

  allNodes$ = combineLatest([
    this.selectedStation$,
    this.searchNodesControl.valueChanges.pipe(startWith('')),
    this.searchChanceControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    switchMap(([station, search, chance]) => {
      this.nodeParams.stationId = station ? station.id : '';
        this.nodeParams.search = search ?? '';
        this.nodeParams.chance = chance ?? '';

        return this.dashboardService.getAllFilteredNodes$(this.nodeParams).pipe(
          map((nodes) => {
            this.totalCount = nodes?.length ?? 0;
            return nodes;
          })
        );
      })
    );
    
  

  filteredNodes$ = combineLatest([
      this.selectedStation$,
      this.searchNodesControl.valueChanges.pipe(
        tap(() => this.onPageChanged(1)),
        startWith('')
      ),
      this.searchChanceControl.valueChanges.pipe(
        tap(() => this.onPageChanged(1)),
        startWith('')
      ),
      this.pageChanged$.pipe(startWith(1)),
      this.sortControl.valueChanges.pipe(startWith('name')),
      this.sortOrderControl.valueChanges.pipe(startWith('asc'))
    ]).pipe(
      switchMap(([station, search, chance, page]) => {
        this.nodeParams.stationId = station ? station.id : '';
        this.nodeParams.search = search ?? '';
        this.nodeParams.chance = chance ?? '';
        this.nodeParams.pageNumber = page;
        
        return this.dashboardService.getFilteredNodes$(this.nodeParams);
      })
    );

  nodesWithLatestData$ = combineLatest([this.filteredNodes$, this.selectedStation$]).pipe(
    switchMap(([nodes, station]) => {
      if (!station || !nodes) {
        return of(null);
      }

      const latestDataObservables = (nodes || []).map((node) => {
        return this.dashboardService.getLatestData$(station.id, node.id).pipe(
          map((latestData) => ({ ...node, ...latestData }))
        );
      });
  
      return combineLatest(latestDataObservables) as Observable<Node[]>;
    })
  );

  constructor(private dashboardService: DashboardService) {}

  getSelectedStationId(stationId: string) {
    this.selectedStationId.next(stationId);
    this.searchNodesControl.setValue('');
  }

  onPageChanged(event: any){
    if(this.nodeParams.pageNumber !== event){
      this.nodeParams.pageNumber = event;
      this.pageChanged.next(event);
    }
  }

  resetSearch(){
    this.searchNodesControl.setValue('');
    this.searchChanceControl.setValue('');
    this.sortControl.setValue('');
    this.sortOrderControl.setValue('');
    this.nodeParams.pageNumber = 1;
  }
}
