import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from 'src/app/account/services/users.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@UntilDestroy()
@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
  styleUrls: ['./node-edit.component.scss']
})
export class NodeEditComponent implements OnInit{

  stationid: string = this.activatedRoute.snapshot.paramMap.get('stationid') ?? '';
  nodeid: string = this.activatedRoute.snapshot.paramMap.get('nodeid') ?? '';


  user$ = this.usersService.currentUserProfile$;
  station$ = this.firestoreService.getStation$(this.stationid);
  node$ = this.firestoreService.getNode$(this.stationid, this.nodeid);

  editForm = this.fb.group({
    id: [''],
    name: [''],
    location: ['']
  })

  constructor(
    private fb: NonNullableFormBuilder,
    private usersService: UsersService,
    private firestoreService: FirestoreService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.node$.pipe(
      untilDestroyed(this)
    ).subscribe(node => {
      if (node) {
        this.editForm.patchValue({
          id: node.id,
          name: node.name,
        });
      }
    });
  
    this.station$.pipe(
      untilDestroyed(this)
    ).subscribe(station => {
      if (station) {
        this.editForm.patchValue({
          location: station.location
        });
      }
    });
  }

  onSubmit() {

  }

}
