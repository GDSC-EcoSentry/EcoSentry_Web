import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/services/account.service';
import { Router } from '@angular/router';
import { LoaderService } from './core/services/loader.service';
import { HttpClient } from '@angular/common/http';

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
    this.accountService.logout().subscribe({
      next: () => this.router.navigateByUrl('/account/login'),
      error: error => console.log(error)
    })
  }
}
