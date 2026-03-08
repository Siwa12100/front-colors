import { Component, input, output, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Folder, Photo } from '../../models';
import { FolderPickerModalComponent } from '../folder-picker-modal/folder-picker-modal';
import { FolderService } from '../../services/folders/folder.service';

@Component({
  selector: 'app-image-card-menu',
  standalone: true,
  imports: [CommonModule, FolderPickerModalComponent],
  templateUrl: './image-card-menu.html',
  styleUrl: './image-card-menu.css',
})
export class ImageCardMenuComponent {
  photo = input.required<Photo>();
  moveToFolder = output<Photo>();

  open = signal(false);

  toggle(event: MouseEvent) {
    this.open.update(v => !v);
    if (this.open()) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.pos.set({ x: rect.right, y: rect.bottom + 4 });
    }
  }

  pos = signal<{ x: number; y: number } | null>(null);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-image-card-menu')) {
      this.open.set(false);
    }
  }

  showPicker = signal(false);

  onMoveToFolder() {
    this.open.set(false);
    this.showPicker.set(true);
  }

  private folderService = inject(FolderService);

  async onFolderSelected(folder: Folder) {
    this.showPicker.set(false);
    try {
      const currentIds = (folder.photoIds as unknown as number[]) ?? [];
      await this.folderService.addPicture(Number(folder.id), currentIds, Number(this.photo().id));
    } catch (err) {
      console.error('Erreur déplacement:', err);
    }
  }
}