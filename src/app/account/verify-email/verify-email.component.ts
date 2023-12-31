import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { HotToastService } from '@ngneat/hot-toast';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit{
  verifyEmailControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private accountService: AccountService, 
    private toast: HotToastService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading.next(true);
    setTimeout(() => {
      this.loaderService.isLoading.next(false);
    }, 1000);
  }

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
