import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceWebClient } from '../../core/http/web-clients/workspace.web-client';
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

  constructor(private workspaceClient: WorkspaceWebClient) { }

  async ngOnInit() {
    this.loading.set(true);
    try {
      const result = await this.workspaceClient.getPictures(1); // TODO: workspace id dynamique
      this.photos.set((result?.data ?? []) as unknown as Photo[]);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  openDetail = output<Photo>();
  onOpenDetail(photo: Photo) {
    this.openDetail.emit(photo);
  }
}