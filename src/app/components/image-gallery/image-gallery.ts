import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceWebClient } from '../../core/http/web-clients/workspace.web-client';
import { ImageCardComponent } from '../image-card/image-card';
import { Photo } from '../../models';
import { mapPhoto, mapPicture } from '../../mappers/picture.mapper';

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
      const workspace_id = localStorage.getItem('workspace_id');
      const result = await this.workspaceClient.getPictures(Number(workspace_id) ?? 1);
      this.photos.set((result?.data ?? []).map(mapPhoto));
      // const mapped = (result?.data ?? []);
      // this.photos.set(mapped as unknown as Photo[]);
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