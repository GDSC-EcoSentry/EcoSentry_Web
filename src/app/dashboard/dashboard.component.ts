import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';

import { Node } from '../shared/models/station';
import { NodeParams } from '../shared/models/nodeParams';
import { FirestoreService } from '../shared/services/firestore.service';

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

  private selectedStationId = new BehaviorSubject<string>('');
  selectedStationId$ = this.selectedStationId.asObservable();

  private pageChanged = new BehaviorSubject<number>(1);
  pageChanged$ = this.pageChanged.asObservable();

  private orderChanged = new BehaviorSubject<string>('asc');
  orderChanged$ = this.orderChanged.asObservable();

  stations$ = combineLatest([
    this.firestoreService.allStations$, 
    this.searchStationsControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([stations, searchString]) => stations.filter(s => s.name?.toLowerCase().includes((searchString ?? '').toLowerCase())))
  )

  selectedStation$ = combineLatest([this.firestoreService.allStations$, this.selectedStationId$]).pipe(
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
        return this.firestoreService.getAllNodes$(station.id).pipe(
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
        
        //Get the filtered nodes and update the latest data to it.
        return this.firestoreService.getFilteredNodes$(this.nodeParams);
      })
    );

  constructor(private firestoreService: FirestoreService) {}

  getSelectedStationId(stationId: string) {
    this.selectedStationId.next(stationId);
  }

  onPageChanged(event: any){
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
}
