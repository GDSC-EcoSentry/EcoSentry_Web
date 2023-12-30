import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, browserLocalPersistence, inMemoryPersistence } from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) { }

  login(username: string, password: string, isPersisted: boolean){
    if(isPersisted) {
      this.auth.setPersistence(browserLocalPersistence);
    }
    else this.auth.setPersistence(inMemoryPersistence);
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(){
    return from(this.auth.signOut());
  }

  forgotPassword(email: string) {
    return from(sendPasswordResetEmail(this.auth, email));
  }
}
