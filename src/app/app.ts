import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { WorkspaceComponent } from './components/workspace/workspace';
import { LoginPage } from './components/login-page/login-page'; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginPage],
  templateUrl: './app.html',
  styleUrl: './app.css', 
  
})

export class App {
  protected readonly title = signal('colors');
  apiBaseUrl = environment.apiBaseUrl;
}
