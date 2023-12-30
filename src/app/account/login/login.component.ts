import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

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
    private router: Router
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
