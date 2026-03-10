import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../services/workspace-service';
import { SourceManagerComponent } from '../source-manager/source-manager';
import { PhotoSource, Workspace } from '../../models';
import { PictureService } from '../../services/pictures/picture.service';

@Component({
  selector: 'app-workspace-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, SourceManagerComponent],
  templateUrl: './workspace-sidebar.html',
  styleUrls: ['./workspace-sidebar.css']
})
export class WorkspaceSidebarComponent {
  svc = inject(WorkspaceService);

  showCreateWs = signal(false);
  newWsName = signal('');
  newWsDesc = signal('');
  expandedSourceWs = signal<string | null>(null);

  toggleCreateWs() { this.showCreateWs.update(v => !v); }
  onWsNameChange(val: string) { this.newWsName.set(val); }
  onWsDescChange(val: string) { this.newWsDesc.set(val); }
  cancelCreateWs() { this.showCreateWs.set(false); }



  createWorkspace() {
    if (!this.newWsName()) return;
    const ws = this.svc.createWorkspace(this.newWsName(), this.newWsDesc());
    this.svc.setActiveWorkspace(ws.id);
    this.newWsName.set('');
    this.newWsDesc.set('');
    this.showCreateWs.set(false);
  }

  toggleSources(wsId: string, e: MouseEvent) {
    e.stopPropagation();
    this.expandedSourceWs.update(id => id === wsId ? null : wsId);
  }

  addSource(wsId: string, source: PhotoSource) {
    this.svc.addSource(wsId, source);
  }

  removeSource(wsId: string, sourceId: string) {
    this.svc.removeSource(wsId, sourceId);
  }
}

