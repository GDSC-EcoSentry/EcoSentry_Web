import { Injectable } from '@angular/core';
import { Firestore, Timestamp, and, collection, collectionData, doc, fromRef, getDocs, limit, orderBy, query, startAt, where } from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { Station, Node, Data } from '../models/station';
import { NodeParams } from '../models/nodeParams';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  //Get all stations
  get allStations$(): Observable<Station[]> {
    const ref = collection(this.firestore, 'stations');
    const queryAll = query(ref, orderBy('name', 'asc'));
    return collectionData(queryAll, {idField: 'id'}) as Observable<Station[]>;
  }

  //Get all nodes from a station
  getAllNodes$(stationId: string): Observable<Node[] | null> {
    const ref = collection(this.firestore, 'stations', stationId, 'nodes');
    const queryAll = query(ref, orderBy('name', 'asc'));
    return collectionData(queryAll, {idField: 'id'}) as Observable<Node[]>
  }

  //Get a specific node from a station
  getNode$(stationId: string, nodeId: string): Observable<Node | null> {
    const nodeRef = doc(this.firestore, 'stations', stationId, 'nodes', nodeId);
    return fromRef(nodeRef).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Node;
        } else {
          return null;
        }
      })
    );
  }

  //Get a station
  getStation$(stationId: string): Observable<Station | null> {
    const stationRef = doc(this.firestore, 'stations', stationId);
    return fromRef(stationRef).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Station;
        } else {
          return null;
        }
      })
    );
  }

  //Sorting, Paging for nodes
  getFilteredNodes$(nodeParams: NodeParams): Observable<Node[] | null> {
    const ref = collection(this.firestore, 'stations', nodeParams.stationId, 'nodes');
    
    const myQuery = query(
      ref, 
      orderBy(nodeParams.sort, (nodeParams.sortOrder === 'asc') ? 'asc' : 'desc'),
    );

    return from(getDocs(myQuery)).pipe(
      switchMap(querySnapshot => {
        const lastVisible = querySnapshot.docs[(nodeParams.pageNumber - 1) * nodeParams.pageSize];
        const next = query(
          ref,
          orderBy(nodeParams.sort, (nodeParams.sortOrder === 'asc') ? 'asc' : 'desc'),
          startAt(lastVisible),
          limit(nodeParams.pageSize)
        );
        return collectionData(next, { idField: 'id' }) as Observable<Node[]>;
      })
    )
  }

  //Get all data of a node
  getData$(stationId: string, nodeId: string, start: Timestamp, end: Timestamp) {
    const ref = collection(this.firestore, 'stations', stationId, 'nodes', nodeId, 'data');
    const queryAll = query(ref, and(where('date', '>=', start), where('date', '<=', end)));
    return collectionData(queryAll) as Observable<Data[]>
  }
}
