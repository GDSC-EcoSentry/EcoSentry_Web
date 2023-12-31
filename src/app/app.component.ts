import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/services/account.service';
import { Router } from '@angular/router';
import { LoaderService } from './core/services/loader.service';
import { delay, finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EcoSentry';

  constructor(
    private accountService: AccountService, 
    private router: Router,
    public loaderService: LoaderService,
  ) {}

  ngOnInit() {
  }

  logout(){
    this.loaderService.isLoading.next(true);
    this.accountService.logout()
    .pipe(
      delay(1000),
      finalize(() => this.loaderService.isLoading.next(false))
    )
    .subscribe({
      next: () => {
        this.router.navigateByUrl('');
        this.loaderService.isLoading.next(false)
      },
      error: error => console.log(error)
    })
  }
}
