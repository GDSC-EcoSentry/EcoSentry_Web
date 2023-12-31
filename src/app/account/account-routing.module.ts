import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { loadingResolver } from '../core/resolvers/loading.resolver';

const redirectToHome = () => redirectLoggedInTo(['']);
const redirectToLogin = () => redirectUnauthorizedTo(['/account/login']);

const routes: Routes = [
  {path: '', component: LoginComponent, ...canActivate(redirectToLogin)},
  {path: 'profile', component: ProfileComponent, resolve: { loading: loadingResolver }, ...canActivate(redirectToLogin)},
  {path: 'login', component: LoginComponent, resolve: { loading: loadingResolver }, ...canActivate(redirectToHome)},
  {path: 'register', component: RegisterComponent, resolve: { loading: loadingResolver }, ...canActivate(redirectToHome)},
  {path: 'verify', component: VerifyEmailComponent, resolve: { loading: loadingResolver }, ...canActivate(redirectToHome)},
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
