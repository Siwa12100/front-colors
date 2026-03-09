import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Folder, Photo, Workspace } from '../../models';
import { ImageDetailPageComponent } from '../image-detail-page/image-detail-page';
import { FolderComponent } from '../folder/folder';
import { SearchBarComponent } from '../search-bar/search-bar';
import { WorkspaceSidebarComponent } from '../workspace-sidebar/workspace-sidebar';
import { ImageGallery } from '../image-gallery/image-gallery';
import { UserMenuComponent } from '../user-menu/user-menu';
import { WorkspaceWebClient } from '../../core/http/web-clients/workspace.web-client';
import { FolderService } from '../../services/folders/folder.service';
import { AccountService } from '../../services/account-service';
import { WorkspaceService as WorkspaceStateService } from '../../services/workspace-service';
import { WorkspaceService } from '../../services/workspaces/workspace.service';


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
export class WorkspaceComponent implements OnInit {
  svc = inject(WorkspaceStateService);

  private accountService = inject(AccountService);
  private folderService = inject(FolderService);
  private workspaceClient = inject(WorkspaceWebClient);

  selectedPhoto = signal<Photo | null>(null);
  showCreateFolder = signal(false);
  newFolderName = signal('');
  viewMode = signal<'grid' | 'masonry'>('grid');
  folders = signal<Folder[]>([]);

  private readonly workspaceId = this.accountService.getWorkspaceId() ?? 1;

  activeFilters = signal<Record<string, any>>({});

  onFiltersApplied(params: Record<string, any>) {
    this.activeFilters.set(params);
  }

  ngOnInit() {
    this.loadWorkspaces();
    this.loadFolders();
  }

  async loadFolders() {
    try {
      const result = await this.workspaceClient.getFolders(this.workspaceId);
      console.log('résultat getFolders:', result);
      const mapped = (result?.data ?? []).map((f: any) => ({
        ...f,
        workspaceId: String(f.workspace_id),
        parentFolderId: f.parent_folder_id,
        photoIds: f.pictures ?? [],
        subFolderIds: [],
        createdAt: new Date(),
        color: '#D97706',
      }));
      this.folders.set(mapped as Folder[]);
      console.log('folders signal:', this.folders());
    } catch (err) {
      console.error('Erreur chargement dossiers:', err);
    }
  }

  async loadWorkspaces() {
    try {
      const user_id = localStorage.getItem('user_id');
      const result = await this.workspaceClient.getAll(Number(user_id));
      console.log(result);
      if (result != null) {
        const mapped = (result?.data ?? []).map((f: any) => ({
          ...f,
          id: String(f.id),
          createdAt: new Date(),
          photoIds: [],
          folderIds: [],
          sources: [],
        }));
        this.svc.setWorkspace(mapped);
        if (mapped.length > 0) {
          this.svc.setActiveWorkspace(mapped[0].id);
        }
      }
    } catch {
    }
  }

  toggleCreateFolder() { this.showCreateFolder.update(v => !v); }
  setViewMode(mode: 'grid' | 'masonry') { this.viewMode.set(mode); }
  onFolderNameChange(val: string) { this.newFolderName.set(val); }
  openDetail(photo: Photo) { this.selectedPhoto.set(photo); }
  closeDetail() { this.selectedPhoto.set(null); }
  dismissCreateFolder() { this.showCreateFolder.set(false); }

  async createFolder() {
    console.log('createFolder appelé', this.newFolderName());
    if (!this.newFolderName()) return;
    try {
      console.log('appel API...', this.workspaceId);
      const result = await this.folderService.create(this.newFolderName(), this.workspaceId, null);
      console.log('résultat:', result);
      this.newFolderName.set('');
      this.showCreateFolder.set(false);
      await this.loadFolders();
    } catch (err) {
      console.error('Erreur:', err);
    }
  }
}