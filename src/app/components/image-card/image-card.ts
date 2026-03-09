import { Component, input, output, signal, OnInit } from '@angular/core';
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
export class ImageCardComponent implements OnInit {
  photo = input.required<Photo>();
  openDetail = output<Photo>();
  moveToFolder = output<Photo>();

  loaded = signal(false);
  hovered = signal(false);
  imageUrl = signal('');

  private static requestCount = 0;
  private static readonly DELAY_MS = 200;

  ngOnInit(): void {
    const delay = ImageCardComponent.requestCount++ * ImageCardComponent.DELAY_MS;
    setTimeout(() => {
      this.imageUrl.set(this.buildImageUrl(this.photo().thumbnailLink));
    }, delay);
  }

  private buildImageUrl(thumbnailLink: string): string {
    // Extract file ID if it's a full Google Drive URL, otherwise use as-is
    // const idMatch = thumbnailLink?.match(/[-\w]{25,}/);
    // const fileId = idMatch ? idMatch[0] : thumbnailLink;
    // return `https://lh3.googleusercontent.com/d/${fileId}=s800`;
    return thumbnailLink;
  }

  onMouseEnter() { this.hovered.set(true); }
  onMouseLeave() { this.hovered.set(false); }
  onImageLoad() { this.loaded.set(true); }

  onImageError(event: any) {
    const img = event.target as HTMLImageElement;
    const retries = parseInt(img.dataset['retries'] || '0');

    if (retries < 3) {
      img.dataset['retries'] = String(retries + 1);
      const delay = 1000 * Math.pow(2, retries); // 1s, 2s, 4s
      console.warn(`Image retry ${retries + 1}/3 in ${delay}ms for:`, this.photo().thumbnailLink);
      setTimeout(() => {
        img.src = `${this.buildImageUrl(this.photo().thumbnailLink)}&bust=${retries}`;
      }, delay);
    } else {
      console.error('Image failed after 3 retries:', this.photo().thumbnailLink);
      this.loaded.set(true); // show slot anyway
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  onDragStart(event: DragEvent) {
    console.log('dragstart!', this.photo().id);
    event.dataTransfer?.setData('pictureId', String(this.photo().id));
    event.dataTransfer!.effectAllowed = 'move';
  }
}
// import { Component, input, output, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Photo } from '../../models';
// import { ImageCardMenuComponent } from '../image-card-menu/image-card-menu';

// @Component({
//   selector: 'app-image-card',
//   standalone: true,
//   imports: [CommonModule, ImageCardMenuComponent],
//   templateUrl: './image-card.html',
//   styleUrls: ['./image-card.css']
// })
// export class ImageCardComponent {
//   photo = input.required<Photo>();
//   openDetail = output<Photo>();

//   loaded = signal(false);
//   hovered = signal(false);
//   moveToFolder = output<Photo>();

//   onMouseEnter() { this.hovered.set(true); }
//   onMouseLeave() {
//     this.hovered.set(false);
//   }

//   onImageLoad() { this.loaded.set(true); }

//   formatSize(bytes: number): string {
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
//     return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
//   }

//   onImageError(event: any) {
//     console.error('Image failed to load:', this.photo().thumbnailLink, event);
//     this.loaded.set(true); // affiche quand même le slot
//   }

//   onDragStart(event: DragEvent) {
//     console.log('dragstart!', this.photo().id);
//     event.dataTransfer?.setData('pictureId', String(this.photo().id));
//     event.dataTransfer!.effectAllowed = 'move';
//   }
// }