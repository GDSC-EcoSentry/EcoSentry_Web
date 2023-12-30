import { Injectable } from '@angular/core';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { ProfileUser } from '../../shared/models/user-profile';
import { Firestore, doc, docData, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.accountService.currentUser$.pipe(
      switchMap(user => {

        if(!user?.uid){
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    )
  }

  constructor(private firestore: Firestore, private accountService: AccountService) { }

  getExistedUser(uid: string): Observable<boolean> {
    const ref = doc(this.firestore, 'users', uid);
    return from(getDoc(ref)).pipe(
      map(doc => doc.exists())
    );
  }

  addUser(user: ProfileUser) : Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser) : Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, {...user}));
  }
}
