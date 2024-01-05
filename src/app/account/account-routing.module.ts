import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { loadingResolver } from '../core/resolvers/loading.resolver';
import { authGuard } from '../core/guards/auth.guard';
import { homeGuard } from '../core/guards/home.guard';


const routes: Routes = [
  {
    path: '', 
    component: LoginComponent,
    canActivate: [homeGuard]
  },
  {
    path: 'profile', 
    component: ProfileComponent, 
    resolve: { loading: loadingResolver }, 
    canActivate: [authGuard]
  },
  {
    path: 'login', component: LoginComponent, 
    resolve: { loading: loadingResolver }, 
    canActivate: [homeGuard]
  },
  {
    path: 'register', 
    component: RegisterComponent, 
    resolve: { loading: loadingResolver }, 
    canActivate: [homeGuard]
  },
  {
    path: 'verify', 
    component: VerifyEmailComponent, 
    resolve: { loading: loadingResolver }, 
    canActivate: [homeGuard]
  },
]

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
export class AccountRoutingModule { }
