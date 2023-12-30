import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ImageUploadService } from '../services/image-upload.service';
import { UsersService } from '../services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProfileUser } from 'src/app/shared/models/user-profile';
import { concatMap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user$ = this.usersService.currentUserProfile$;

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });

  constructor(
    private imageUploadService: ImageUploadService, 
    private usersService: UsersService,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.usersService.currentUserProfile$.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.profileForm.patchValue({ ...user });
    })
  }

  uploadImage(event: any, { uid }: ProfileUser){
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${uid}`).pipe(
      concatMap((photoURL) => this.usersService.updateUser({ uid, photoURL }))
    ).subscribe();
  }

  saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    }

    this.usersService
      .updateUser({ uid, ...data })
      .subscribe();
  }
}
