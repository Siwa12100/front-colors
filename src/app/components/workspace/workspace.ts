import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../services/workspace-service';
import { Photo } from '../../models';
import { ImageDetailPageComponent } from '../image-detail-page/image-detail-page';
import { FolderComponent } from '../folder/folder';
import { SearchBarComponent } from '../search-bar/search-bar';
import { WorkspaceSidebarComponent } from '../workspace-sidebar/workspace-sidebar';
import { ImageGallery } from '../image-gallery/image-gallery';
import { UserMenuComponent } from '../user-menu/user-menu';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ImageDetailPageComponent,
    FolderComponent,
    SearchBarComponent,
    WorkspaceSidebarComponent,
    ImageGallery,
    UserMenuComponent
  ],
  templateUrl: './workspace.html',
  styleUrls: ['./workspace.css']
})
export class WorkspaceComponent {
  svc = inject(WorkspaceService);

  selectedPhoto = signal<Photo | null>(null);
  showCreateFolder = signal(false);
  newFolderName = signal('');
  viewMode = signal<'grid' | 'masonry'>('grid');

  toggleCreateFolder() { this.showCreateFolder.update(v => !v); }
  setViewMode(mode: 'grid' | 'masonry') { this.viewMode.set(mode); }
  onFolderNameChange(val: string) { this.newFolderName.set(val); }
  openDetail(photo: Photo) { this.selectedPhoto.set(photo); }
  closeDetail() { this.selectedPhoto.set(null); }
  dismissCreateFolder() { this.showCreateFolder.set(false); }

  createFolder() {
    const ws = this.svc.activeWorkspace();
    if (!this.newFolderName() || !ws) return;
    this.svc.createFolder(this.newFolderName(), ws.id);
    this.newFolderName.set('');
    this.showCreateFolder.set(false);
  }
}