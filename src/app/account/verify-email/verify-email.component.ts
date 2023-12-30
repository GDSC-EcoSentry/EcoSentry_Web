import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
  verifyEmailControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private accountService: AccountService, 
  ) {}

  sendVerification(){
    const email = this.verifyEmailControl.value;
    if(email) this.accountService.forgotPassword(email)
    .subscribe({
      error: error => console.log(error)
    })
  }
}
