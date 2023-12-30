import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UsersService } from './../../account/services/users.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input()
  sidenav!: MatSidenav;

  constructor(private usersService: UsersService) {}

  user$ = this.usersService.currentUserProfile$;
}
