import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../account/services/users.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {

  createForm = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    location: ['', Validators.required]
  })

  user$ = this.usersService.currentUserProfile$;

  constructor(
    private fb: NonNullableFormBuilder,
    private usersService: UsersService,
  ) {}



  onSubmit() {
    
  }
}
