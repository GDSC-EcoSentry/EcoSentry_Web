import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/services/account.service';
import { Router } from '@angular/router';
import { LoaderService } from './core/services/loader.service';
import { UsersService } from './account/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  user$ = this.usersService.currentUserProfile$;

  constructor(
    private accountService: AccountService, 
    private router: Router,
    public loaderService: LoaderService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
  }

  logout(){
    this.accountService.logout()
    .subscribe({
      next: () => {
        this.router.navigateByUrl('/account/login');
      },
      error: error => console.log(error)
    })
  }
}
