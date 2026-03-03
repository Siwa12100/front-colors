import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { RegisterPage } from './components/register-page/register-page';
import { LoginPage } from './components/login-page/login-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'home', component: HomePage}];
