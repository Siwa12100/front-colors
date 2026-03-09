import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Photo } from '../models';

export interface PictureFilters {
  name?: string;
  tags?: number[];       // tag IDs
  mimeTypes?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  perPage?: number;
}

export interface PaginatedPhotos {
  items: Photo[];
  total: number;
  page: number;
  pages: number;
}

@Injectable({ providedIn: 'root' })
export class PictureFiltersService {
  private http = inject(HttpClient);
  private baseUrl = '/api/pictures';

  // async getPhotos(filters: PictureFilters): Promise<PaginatedPhotos> {
  //   let params = new HttpParams();

  //   if (filters.name)
  //     params = params.set('name', filters.name);

  //   if (filters.tags?.length)
  //     filters.tags.forEach(id => params = params.append('tags', id));

  //   if (filters.mimeTypes?.length)
  //     filters.mimeTypes.forEach(m => params = params.append('mimeTypes', m));

  //   if (filters.dateFrom)
  //     params = params.set('updated_after', filters.dateFrom.toISOString());

  //   params = params.set('page', filters.page ?? 1);
  //   params = params.set('per_page', filters.perPage ?? 50);

  //   return firstValueFrom(
  //     this.http.get<PaginatedPhotos>(this.baseUrl, { params })
  //   );
  // }

  async getPhotos(filters: any): Promise<any> {
    const workspace_id = localStorage.getItem('workspace_id');
    let params = new HttpParams()
      .set('workspace_id', workspace_id ?? '1');  // ← sans ça l'API retourne rien

    if (filters.name) params = params.set('name', filters.name);
    if (filters.tags?.length)
      filters.tags.forEach((id: number) => params = params.append('tags', id));
    if (filters.mimeTypes?.length)
      filters.mimeTypes.forEach((m: string) => params = params.append('mimeTypes', m));
    if (filters.dateFrom)
      params = params.set('updated_after', filters.dateFrom.toISOString());

    return firstValueFrom(
      this.http.get<any>('/api/pictures', { params })
    );
  }
}