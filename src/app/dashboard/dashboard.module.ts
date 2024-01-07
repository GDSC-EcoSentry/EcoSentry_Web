import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { StationComponent } from './station/station.component';
import { NodeComponent } from './node/node.component';
import { NodeEditComponent } from './node-edit/node-edit.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StationComponent,
    NodeComponent,
    NodeEditComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
