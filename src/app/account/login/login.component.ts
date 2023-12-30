import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { of, switchMap } from 'rxjs';
import { UsersService } from './../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isPersisted = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: NonNullableFormBuilder, 
    private accountService: AccountService, 
    private router: Router,
    private usersService: UsersService
  ) {}

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }

  onChange(event: any) {
    this.isPersisted = event.target.checked;
    console.log(this.isPersisted);
  }

  signInWithGoogle() {
    this.accountService.signInWithGoogle()
    .subscribe({
      next: ({ user: { uid, email } }) => {
        const username = email?.substring(0, email.indexOf('@'));
        this.usersService.getExistedUser(uid).subscribe({
          next: (userExisted) => {
            if(!userExisted && uid && email && username) {
              this.usersService.addUser({ uid, email, username }).subscribe({
                next: () => this.router.navigateByUrl('')
              });
            }
            else this.router.navigateByUrl('');
          }
        })
      },
      error: error => {
        console.log(error);
      }
    });
  }

  onSubmit(){
    if(!this.loginForm.valid){
      return;
    }

    const {email, password} = this.loginForm.value;
    if(email && password) this.accountService.login(email, password, this.isPersisted)
    .subscribe({
      next: () => this.router.navigateByUrl(''),
      error: error => {
        console.log(error);
        this.email?.setErrors({ invalidCredentials: true });
        this.password?.setErrors({ invalidCredentials: true });
      }  
    });
  }
}
