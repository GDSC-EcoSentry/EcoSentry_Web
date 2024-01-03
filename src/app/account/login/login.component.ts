import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { UsersService } from './../services/users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  isPersisted = false;
  returnUrl: string;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: NonNullableFormBuilder, 
    private accountService: AccountService, 
    private router: Router,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute
  ) {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || ''
  }

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
              this.usersService.addUser({ uid, email, username, role: 'user' })
              .subscribe({
                next: () => {
                  this.router.navigateByUrl(this.returnUrl);
                }
              });
            }
            else {
              this.router.navigateByUrl(this.returnUrl);
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
      this.accountService.login(email, password, this.isPersisted)
      .subscribe({
        next: () => {
          this.router.navigateByUrl(this.returnUrl);
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
