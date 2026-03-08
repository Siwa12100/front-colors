import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { AuthCallbackPage } from './components/auth-callback-page/auth-callback-page';
import { HomePage } from './components/home-page/home-page';
import { WorkspaceComponent } from './components/workspace/workspace';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component: LoginPage },
    { path: 'auth/callback', component: AuthCallbackPage },
    { path: 'home', component: WorkspaceComponent }];
