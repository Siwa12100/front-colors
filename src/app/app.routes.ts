import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { RegisterPage } from './components/register-page/register-page';
import { LoginPage } from './components/login-page/login-page';
import { AuthCallbackPage } from './components/auth-callback-page/auth-callback-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'auth/callback', component: AuthCallbackPage },
    { path: 'home', component: HomePage }];
