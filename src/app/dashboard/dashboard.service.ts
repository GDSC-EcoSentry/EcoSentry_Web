import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData,  doc,  getDocs, limit, orderBy, query, startAfter, startAt,  updateDoc,  where } from '@angular/fire/firestore';
import { Data, Node, Station } from '../shared/models/station';
import { Observable, from, map, switchMap } from 'rxjs';
import { NodeParams } from '../shared/models/nodeParams';


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

  getAllFilteredNodes$(nodeParams: NodeParams): Observable<Node[] | null> {
    const ref = collection(this.firestore, 'stations', nodeParams.stationId, 'nodes');
    const queryAll = query(ref,
      
      orderBy('name', 'asc'),
    );
    return collectionData(queryAll, {idField: 'id'}) as Observable<Node[]>
  }

  getFilteredNodes$(nodeParams: NodeParams): Observable<Node[] | null> {
    const ref = collection(this.firestore, 'stations', nodeParams.stationId, 'nodes');
    
    const myQuery = query(
      ref, 
      
      orderBy('name', 'asc'),
    );

    return from(getDocs(myQuery)).pipe(
      switchMap(querySnapshot => {
        const lastVisible = querySnapshot.docs[(nodeParams.pageNumber - 1) * nodeParams.pageSize];
        console.log(lastVisible);
        
        const next = query(
          ref,
          
          orderBy('name', 'asc'),
          startAt(lastVisible),
          limit(nodeParams.pageSize)
        );
        return collectionData(next, { idField: 'id' }) as Observable<Node[]>;
      })
    )
  }

  getLatestData$(stationId: string, nodeId: string): Observable<Data | null> {
    const stationRef = doc(this.firestore, 'stations', stationId);
    const nodeRef = doc(stationRef, 'nodes', nodeId);
    const dataQuery = query(collection(nodeRef, 'data'), orderBy('date', 'desc'), limit(1));
    return from(getDocs(dataQuery)).pipe(
      map(querySnapshot => {
        if(querySnapshot.size > 0) {
          const dataDoc = querySnapshot.docs[0];
          const latestData = {...dataDoc.data() } as Data;
          updateDoc(nodeRef, { ...latestData });
          return latestData;
        }
        else {
          return null;
        }
      })
    )
  }
}
