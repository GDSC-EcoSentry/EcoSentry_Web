import { Component } from '@angular/core';
import { AccountService } from './account/services/account.service';
import { Router } from '@angular/router';
import { UsersService } from './account/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EcoSentry';

  constructor(
    private accountService: AccountService, 
    private router: Router,
  ) {}

  logout(){
    this.accountService.logout().subscribe({
      next: () => this.router.navigateByUrl('/account/login'),
      error: error => console.log(error)
    })
  }
}
