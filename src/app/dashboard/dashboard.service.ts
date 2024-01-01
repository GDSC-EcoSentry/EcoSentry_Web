import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { Node, Station } from '../shared/models/station';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private firestore: Firestore) { }

  get allStations$(): Observable<Station[]> {
    const ref = collection(this.firestore, 'stations');
    const queryAll = query(ref, orderBy('name', 'asc'));
    return collectionData(queryAll, {idField: 'id'}) as Observable<Station[]>;
  }

  getAllNodes$(stationId: string): Observable<Node[] | null> {
    const ref = collection(this.firestore, 'stations', stationId, 'nodes');
    const queryAll = query(ref, orderBy('name', 'asc'));
    return collectionData(queryAll, {idField: 'id'}) as Observable<Node[]>
  }
}
