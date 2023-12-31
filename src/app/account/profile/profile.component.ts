import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ImageUploadService } from '../services/image-upload.service';
import { UsersService } from '../services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProfileUser } from 'src/app/shared/models/user-profile';
import { concatMap, delay, finalize } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { LoaderService } from 'src/app/core/services/loader.service';

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
    username: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: [''],
  });

  constructor(
    private imageUploadService: ImageUploadService, 
    private usersService: UsersService,
    private fb: NonNullableFormBuilder,
    private toast: HotToastService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading.next(true);
    this.usersService.currentUserProfile$.pipe(
      delay(1000),
      untilDestroyed(this)
    ).subscribe((user) => {
      this.profileForm.patchValue({ ...user });
      this.loaderService.isLoading.next(false);
    });
  }

  uploadImage(event: any, { uid }: ProfileUser){
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${uid}`).pipe(
      this.toast.observe({
        success: 'Image uploaded',
        loading: 'Uploading Image...',
        error: 'An error occured when uploading image'
      }),
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
      .pipe(
        this.toast.observe({
          loading: 'Saving profile data...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
        })
      )
      .subscribe();
  }
}
