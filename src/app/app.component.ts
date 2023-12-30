import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/services/account.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BusyService } from './core/services/busy.service';

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
