import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../../models';
import { ImageCardMenuComponent } from '../image-card-menu/image-card-menu';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [CommonModule, ImageCardMenuComponent],
  templateUrl: './image-card.html',
  styleUrls: ['./image-card.css']
})
export class ImageCardComponent {
  photo = input.required<Photo>();
  openDetail = output<Photo>();
  context = input<'folder' | 'workspace'>('workspace');
  removeFromContext = output<Photo>();

  loaded = signal(false);
  hovered = signal(false);
  moveToFolder = output<Photo>();

  onMouseEnter() { this.hovered.set(true); }
  onMouseLeave() {
    this.hovered.set(false);
  }

  onImageLoad() { this.loaded.set(true); }

  formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  onImageError(event: any) {
    console.error('Image failed to load:', this.photo().thumbnailLink, event);
    this.loaded.set(true); // affiche quand même le slot
  }

  onDragStart(event: DragEvent) {
    console.log('dragstart!', this.photo().id);
    event.dataTransfer?.setData('pictureId', String(this.photo().id));
    event.dataTransfer!.effectAllowed = 'move';
  }
}