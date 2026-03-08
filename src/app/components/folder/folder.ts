import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Folder, Photo } from '../../models';
import { WorkspaceService } from '../../services/workspace-service';
import { ImageCardComponent } from '../image-card/image-card';
import { ImageDetailPageComponent } from '../image-detail-page/image-detail-page';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCardComponent, ImageDetailPageComponent],
  templateUrl: './folder.html',
  styleUrls: ['./folder.css']
})
export class FolderComponent {
  folder = input.required<Folder>();
  private svc = inject(WorkspaceService);

  expanded = signal(false);
  showCreateSub = signal(false);
  newSubName = signal('');
  selectedPhoto = signal<Photo | null>(null);

  toggleExpanded() { this.expanded.update(v => !v); }
  toggleCreateSub() { this.showCreateSub.update(v => !v); }
  onSubNameChange(val: string) { this.newSubName.set(val); }
  closeCreateSub() { this.showCreateSub.set(false); }
  openDetail(photo: Photo) { this.selectedPhoto.set(photo); }
  closeDetail() { this.selectedPhoto.set(null); }

  get photos(): Photo[] {
    return this.svc.getPhotosInFolder(this.folder().id);
  }

  get subFolders(): Folder[] {
    return this.svc.getSubFolders(this.folder().id);
  }

  createSubFolder() {
    if (!this.newSubName()) return;
    this.svc.createFolder(this.newSubName(), this.folder().workspaceId, this.folder().id);
    this.newSubName.set('');
    this.showCreateSub.set(false);
  }
}