import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from 'src/app/account/services/users.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@UntilDestroy()
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit{

  stationid: string = this.activatedRoute.snapshot.paramMap.get('stationid') ?? '';

  user$ = this.usersService.currentUserProfile$;
  station$ = this.firestoreService.getStation$(this.stationid);

  editForm = this.fb.group({
    id: [''],
    name: [''],
    location: ['']
  })

  addNodeForm = this.fb.group({
    stationId: [''],
    nodeId: [''],
    name: ['']
  })

  constructor(
    private fb: NonNullableFormBuilder,
    private usersService: UsersService,
    private firestoreService: FirestoreService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.station$.pipe(
      untilDestroyed(this)
    ).subscribe(station => {
      if (station) {
        this.editForm.patchValue({
          ...station
        });
        this.addNodeForm.patchValue({
          stationId: station.id
        })
      }
    });
  }

  onSubmit() {
    
  }
}
