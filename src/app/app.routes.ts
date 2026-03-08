import { Routes } from '@angular/router';
import { RegisterPage } from './components/register-page/register-page';
import { LoginPage } from './components/login-page/login-page';

export const routes: Routes = [
    { path: '', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage }];
