import { Component } from '@angular/core';
import {  AbstractControl, AsyncValidatorFn, NonNullableFormBuilder, Validators } from '@angular/forms';
import { debounceTime, finalize, map, of, switchMap, take } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  complexPassword = "^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)(?=.*[@*#!%^&$~_:/?><,.\|]*.*)[0-9a-zA-Z@*#!%^&$~_:/?><,.\|]{6,}$"

  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(this.complexPassword)]],
    confirmPassword: ['', [Validators.required], [this.validatePasswordNotMatch()]]
  });

  constructor(private fb: NonNullableFormBuilder) {}

  onSubmit() {

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
