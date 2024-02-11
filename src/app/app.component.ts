import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/services/account.service';
import { Router } from '@angular/router';
import { LoaderService } from './core/services/loader.service';
import { UsersService } from './account/services/users.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  user$ = this.usersService.currentUserProfile$;
  isSmallScreen = false;

  constructor(
    private accountService: AccountService, 
    private router: Router,
    public loaderService: LoaderService,
    private usersService: UsersService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnInit() {
    
  }

  getSideNavMode() {
    return this.isSmallScreen ? 'over' : 'side';
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
