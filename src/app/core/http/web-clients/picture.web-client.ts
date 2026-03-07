import { Injectable } from '@angular/core';
import { BaseWebClient } from '../base-web-client';
import { PictureDto } from '../../../dtos/picture.dto';
import { PaginationDto } from '../../../dtos/pagination.dto';

@Injectable({ providedIn: 'root' })
export class PictureWebClient {
  private readonly route = '/api/pictures';

  constructor(private readonly base: BaseWebClient) {}

  async uploadFromDrive(): Promise<{ pictures_added_count: number } | null> {
    return this.base.get<{ pictures_added_count: number }>(
      `${this.route}/upload`
    );
  }

  async getAll(
    page = 1,
    perPage = 20,
    filters?: Record<string, string | number | boolean>
  ): Promise<PaginationDto<PictureDto> | null> {
    return this.base.get<PaginationDto<PictureDto>>(this.route, {
      params: {
        page,
        per_page: perPage,
        ...filters,
      },
    });
  }

  async getById(id: number): Promise<PictureDto | null> {
    return this.base.get<PictureDto>(`${this.route}/${id}`);
  }

  async update(
    id: number,
    payload: Partial<PictureDto>
  ): Promise<PictureDto | null> {
    return this.base.put<Partial<PictureDto>, PictureDto>(
      `${this.route}/${id}`,
      payload
    );
  }
}
