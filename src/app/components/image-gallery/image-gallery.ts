import { Component, effect, input, OnInit, output, signal } from '@angular/core';
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
  openDetail = output<Photo>();
  filterParams = input<Record<string, any>>({});

  constructor(private workspaceClient: WorkspaceWebClient) {
    // Re-fetch whenever filterParams changes
    effect(() => {
      const params = this.filterParams();
      this.fetchPhotos(params);
    });
  }

  async ngOnInit() {
    // Initial load with no filters (effect handles it, but call explicitly if needed)
  }

  // async ngOnInit() {
  //   this.loading.set(true);
  //   try {
  //     const workspace_id = localStorage.getItem('workspace_id');
  //     const result = await this.workspaceClient.getPictures(Number(workspace_id) ?? 1);
  //     this.photos.set((result?.data ?? []).map(mapPhoto));
  //     // const mapped = (result?.data ?? []);
  //     // this.photos.set(mapped as unknown as Photo[]);
  //   } catch (err: any) {
  //     this.error.set(err.message);
  //   } finally {
  //     this.loading.set(false);
  //   }
  // }

  onOpenDetail(photo: Photo) {
    this.openDetail.emit(photo);
  }

  async fetchPhotos(params: Record<string, any> = {}) {
    this.loading.set(true);
    this.error.set('');
    try {
      const workspace_id = Number(localStorage.getItem('workspace_id')) || 1;
      console.log("Params : ")
      console.log(params)
      const result = await this.workspaceClient.getPictures(workspace_id, 1, 100, params);
      this.photos.set((result?.data ?? []).map(mapPhoto));
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }
}




