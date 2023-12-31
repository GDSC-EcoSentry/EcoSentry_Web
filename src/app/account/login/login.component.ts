import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { delay, finalize, of, switchMap } from 'rxjs';
import { UsersService } from './../services/users.service';
import { LoaderService } from './../../core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  isPersisted = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: NonNullableFormBuilder, 
    private accountService: AccountService, 
    private router: Router,
    private usersService: UsersService,
    private loaderService: LoaderService
  ) {}

  get email(){
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    this.loaderService.isLoading.next(true);
    setTimeout(() => {
      this.loaderService.isLoading.next(false);
    }, 1000);
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
            this.loaderService.isLoading.next(true);
            if(!userExisted && uid && email && username) {
              this.usersService.addUser({ uid, email, username })
              .pipe(
                delay(1000),
              )
              .subscribe({
                next: () => {
                  this.router.navigateByUrl('');
                  this.loaderService.isLoading.next(false)
                }
              });
            }
            else {
              setTimeout(() => {
                this.loaderService.isLoading.next(false);
                this.router.navigateByUrl('');
              }, 1000);
            }
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
    if(email && password) {
      this.loaderService.isLoading.next(true);
      this.accountService.login(email, password, this.isPersisted)
      .pipe(
        delay(1000),
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('');
          this.loaderService.isLoading.next(false)
        },
        error: error => {
          console.log(error);
          this.email?.setErrors({ invalidCredentials: true });
          this.password?.setErrors({ invalidCredentials: true });
        }  
      });
    }
  }
}
