import { Injectable } from '@angular/core';
import { BaseWebClient } from '../base-web-client';
import { FolderDto } from '../../../dtos/folder.dto';
import { PaginationDto } from '../../../dtos/pagination.dto';
import { PictureDto } from '../../../dtos/picture.dto';

@Injectable({ providedIn: 'root' })
export class FolderWebClient {
  private readonly route = '/api/folders';

  constructor(private readonly base: BaseWebClient) {}

  async getById(id: number): Promise<FolderDto | null> {
    return this.base.get<FolderDto>(`${this.route}/${id}`);
  }

  async getPictures(
    id: number,
    page = 1,
    perPage = 20
  ): Promise<PaginationDto<PictureDto> | null> {
    return this.base.get<PaginationDto<PictureDto>>(
      `${this.route}/${id}/pictures`,
      { params: { page, per_page: perPage } }
    );
  }

  async getChildren(
    id: number
  ): Promise<{ data: FolderDto[]; total: number } | null> {
    return this.base.get<{ data: FolderDto[]; total: number }>(
      `${this.route}/${id}/folders`
    );
  }

  async create(payload: {
    name: string;
    workspace_id: number;
    parent_folder_id?: number | null;
  }): Promise<FolderDto | null> {
    return this.base.post<typeof payload, FolderDto>(
      this.route,
      payload
    );
  }

  async update(
    id: number,
    payload: Partial<FolderDto>
  ): Promise<FolderDto | null> {
    return this.base.put<Partial<FolderDto>, FolderDto>(
      `${this.route}/${id}`,
      payload
    );
  }

  async delete(id: number): Promise<{ message: string } | null> {
    return this.base.delete<{ message: string }>(
      `${this.route}/${id}`
    );
  }
}
