import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../services/images-service';
import { ImageCardComponent } from '../image-card/image-card';
import { Photo } from '../../models';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, ImageCardComponent],
  templateUrl: './image-gallery.html',
  styleUrl: './image-gallery.css',
})
export class ImageGallery implements OnInit {
  photos = signal<Photo[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(private imagesService: ImagesService) { }

  async ngOnInit() {
    this.loading.set(true);
    try {
      const { data } = await this.imagesService.getImagesByWorkspace();
      this.photos.set(data as Photo[]);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  onOpenDetail(photo: Photo) {
    console.log('Détail :', photo);
  }
}