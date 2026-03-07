import { Injectable } from '@angular/core';
import { PictureWebClient } from '../../core/http/web-clients/picture.web-client';
import { IPictureService, PictureSearchFilters } from './IPictureService';
import { mapPicture } from '../../mappers/picture.mapper';
import { mapPagination } from '../../mappers/pagination.mapper';
import { Picture } from '../../models/picture.model';

@Injectable({ providedIn: 'root' })
export class PictureService implements IPictureService {

  constructor(private readonly client: PictureWebClient) {}

  async search(filters?: PictureSearchFilters, page = 1, perPage = 20) {
    const dto = await this.client.getAll(page, perPage, filters as any);
    if (!dto) throw new Error('Failed to load pictures');
    return mapPagination(dto, mapPicture);
  }

  async getById(id: number) {
    const dto = await this.client.getById(id);
    if (!dto) throw new Error('Picture not found');
    return mapPicture(dto);
  }

  async update(id: number, data: Partial<Picture>) {

  const payload: any = {};

  if (data.name !== undefined) {
    payload.name = data.name;
  }

  if (data.comment !== undefined) {
    payload.comment = data.comment;
  }

  const dto = await this.client.update(id, payload);

  if (!dto) throw new Error('Failed to update picture');

  return mapPicture(dto);
}


  async uploadFromDrive() {
    const dto = await this.client.uploadFromDrive();
    if (!dto) throw new Error('Upload failed');
    return dto.pictures_added_count;
  }
}
