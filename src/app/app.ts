import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { WorkspaceComponent } from './components/workspace/workspace';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WorkspaceComponent],
  templateUrl: './app.html',
  styleUrl: './app.css', 
  
})

export class App {
  protected readonly title = signal('colors');
  apiBaseUrl = environment.apiBaseUrl;
}
