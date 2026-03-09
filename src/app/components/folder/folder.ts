import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Folder, Photo } from '../../models';
import { FolderService } from '../../services/folders/folder.service';
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
  private folderService = inject(FolderService);

  expanded = signal(false);
  showCreateSub = signal(false);
  newSubName = signal('');
  selectedPhoto = signal<Photo | null>(null);
  photos = signal<Photo[]>([]);
  subFolders = signal<Folder[]>([]);

  toggleExpanded() {
    this.expanded.update(v => !v);
    if (this.expanded()) {
      this.loadContent();
    }
  }

  async loadContent() {
    try {
      const [picturesResult, foldersResult] = await Promise.all([
        this.folderService.getPictures(Number(this.folder().id)),
        this.folderService.getChildren(Number(this.folder().id)),
      ]);
      this.photos.set(picturesResult.items.map((p: any) => ({
        ...p,
        thumbnailLink: p.thumbnailUrl,
        downloadLink: p.downloadUrl,
      })) as unknown as Photo[]);
      this.subFolders.set(foldersResult as unknown as Folder[]);
    } catch (err) {
      console.error('Erreur chargement dossier:', err);
    }
  }

  toggleCreateSub() { this.showCreateSub.update(v => !v); }
  onSubNameChange(val: string) { this.newSubName.set(val); }
  closeCreateSub() { this.showCreateSub.set(false); }
  openDetail(photo: Photo) { this.selectedPhoto.set(photo); }
  closeDetail() { this.selectedPhoto.set(null); }

  async createSubFolder() {
    if (!this.newSubName()) return;
    try {
      await this.folderService.create(
        this.newSubName(),
        Number(this.folder().workspaceId),
        Number(this.folder().id)
      );
      this.newSubName.set('');
      this.showCreateSub.set(false);
      await this.loadContent();
    } catch (err) {
      console.error('Erreur création sous-dossier:', err);
    }
  }

  async toggleRemoveFolder()
  {
    try {
      await this.folderService.delete(Number(this.folder().id));
    } catch(err) {
      console.error('Erreur de suppression du dossier : ', err)
    }
  }


  showRename = signal(false);
  renameName = signal('');
  folderUpdated = output<void>();

  toggleRename() {
    this.renameName.set(this.folder().name);
    this.showRename.update(v => !v);
  }
  onRenameChange(val: string) { this.renameName.set(val); }
  closeRename() { this.showRename.set(false); }

  async renameFolder() {
    if (!this.renameName()) return;
    try {
      await this.folderService.update(Number(this.folder().id), { name: this.renameName() });
      this.showRename.set(false);
      this.folderUpdated.emit();
    } catch (err) {
      console.error('Erreur renommage:', err);
    }
  }

  isDragOver = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) { this.isDragOver.set(false); }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    const pictureId = Number(event.dataTransfer?.getData('pictureId'));
    if (!pictureId) return;

    try {
      const currentIds = (this.folder().photoIds as unknown as number[]) ?? [];
      await this.folderService.addPicture(Number(this.folder().id), currentIds, pictureId);
      this.folderUpdated.emit();
      await this.loadContent();
    } catch (err) {
      console.error('Erreur ajout image:', err);
    }
  }
}