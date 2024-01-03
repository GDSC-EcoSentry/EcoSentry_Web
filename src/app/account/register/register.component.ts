import { Component } from '@angular/core';
import {  AbstractControl, AsyncValidatorFn, NonNullableFormBuilder, Validators } from '@angular/forms';
import { debounceTime, delay, finalize, map, of, switchMap, take } from 'rxjs';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent{
  complexPassword = "^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)(?=.*[@*#!%^&$~_:/?><,.\|]*.*)[0-9a-zA-Z@*#!%^&$~_:/?><,.\|]{6,}$";
  returnUrl: string;

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(this.complexPassword)]],
    confirmPassword: ['', [Validators.required], [this.validatePasswordNotMatch()]]
  });

  constructor(
    private fb: NonNullableFormBuilder, 
    private accountService: AccountService, 
    private router: Router, 
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute
  ) {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || ''
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit(){
    if(!this.registerForm.valid) return;

    const { username, email, password } = this.registerForm.value;
    if(username && email && password) {
      this.accountService.register(email, password).pipe(
        switchMap(({ user: { uid } }) => this.usersService.addUser({ uid, email, username, role: 'user' }))
      ).subscribe({
        next: () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        error: error => {
          console.log(error);
          this.email?.setErrors({ emailExists: true });
        }
      })
    }
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

  validatePasswordNotMatch(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          return of(this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value).pipe(
            map(result => result ? {passwordNotMatch: true} : null),
            finalize(() => control.markAsTouched())
          )
        })
      )
    }
  }
}
