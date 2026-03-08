import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Folder } from '../../models';
import { WorkspaceWebClient } from '../../core/http/web-clients/workspace.web-client';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-folder-picker-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './folder-picker-modal.html',
  styleUrl: './folder-picker-modal.css',
})
export class FolderPickerModalComponent implements OnInit {
  close = output<void>();
  folderSelected = output<Folder>();

  private workspaceClient = inject(WorkspaceWebClient);
  private accountService = inject(AccountService);

  folders = signal<Folder[]>([]);
  expanded = signal<Set<number>>(new Set());
  private readonly workspaceId = this.accountService.getWorkspaceId() ?? 1;

  async ngOnInit() {
    try {
      const result = await this.workspaceClient.getFolders(this.workspaceId);
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
    } catch (err) {
      console.error('Erreur chargement dossiers:', err);
    }
  }

  toggleExpand(folder: Folder) {
    const set = new Set(this.expanded());
    if (set.has(Number(folder.id))) {
      set.delete(Number(folder.id));
    } else {
      set.add(Number(folder.id));
    }
    this.expanded.set(set);
  }

  // mergeChildren(list: Folder[], parentId: number, children: Folder[]): Folder[] {
  //   return list.map(f => {
  //     if (Number(f.id) === parentId) return { ...f, children };
  //     if (f.children?.length) return { ...f, children: this.mergeChildren(f.children, parentId, children) };
  //     return f;
  //   });
  // }

  select(folder: Folder) {
    this.folderSelected.emit(folder);
    this.close.emit();
  }
}