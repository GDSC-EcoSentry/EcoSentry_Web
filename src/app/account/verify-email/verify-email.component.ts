import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent{
  verifyEmailControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private accountService: AccountService, 
    private toast: HotToastService,
  ) {}

  sendVerification(){
    const email = this.verifyEmailControl.value;
    if(email) this.accountService.forgotPassword(email).pipe(
      this.toast.observe({
        success: 'Email Verification Sent',
        loading: 'Sending...',
        error: 'Invalid Email'
      })
    )
    .subscribe({
      error: error => {
        console.log(error),
        this.verifyEmailControl?.setErrors({ invalidEmail: true });
      }
    })
  }
}
