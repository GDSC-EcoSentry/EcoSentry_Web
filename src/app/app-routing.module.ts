import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { loadingResolver } from './core/resolvers/loading.resolver';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, resolve: { loading: loadingResolver }},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  {path: 'panel', component: AdminPanelComponent, resolve: { loading: loadingResolver }, canActivate: [authGuard]},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
