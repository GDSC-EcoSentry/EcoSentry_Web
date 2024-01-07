import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { loadingResolver } from '../core/resolvers/loading.resolver';
import { StationComponent } from './station/station.component';
import { NodeComponent } from './node/node.component';
import { authGuard } from '../core/guards/auth.guard';
import { NodeEditComponent } from './node-edit/node-edit.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, resolve: { loading: loadingResolver }},
  {
    path: 'stations/:stationid', 
    component: StationComponent, 
    resolve: {loading: loadingResolver},
    canActivate: [authGuard]
  },
  {
    path: 'stations/:stationid/nodes/:nodeid', 
    component: NodeComponent, 
    resolve: {loading: loadingResolver},
    canActivate: [authGuard]
  },
  {
    path: 'stations/:stationid/node-edit/:nodeid', 
    component: NodeEditComponent, 
    resolve: {loading: loadingResolver},
    canActivate: [authGuard]
  },
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
