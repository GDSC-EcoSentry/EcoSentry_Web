import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { loadingResolver } from '../core/resolvers/loading.resolver';
import { StationComponent } from './station/station.component';
import { NodeComponent } from './node/node.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, resolve: { loading: loadingResolver }},
  {path: 'stations/:stationid', component: StationComponent, resolve: {loading: loadingResolver}},
  {path: 'stations/:stationid/nodes/:nodeid', component: NodeComponent, resolve: {loading: loadingResolver}},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule { }
