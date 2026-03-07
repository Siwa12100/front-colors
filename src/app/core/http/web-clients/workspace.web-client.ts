import { Injectable } from '@angular/core';
import { BaseWebClient } from '../base-web-client';
import { WorkspaceDto } from '../../../dtos/workspace.dto';
import { PaginationDto } from '../../../dtos/pagination.dto';
import { PictureDto } from '../../../dtos/picture.dto';
import { FolderDto } from '../../../dtos/folder.dto';

@Injectable({ providedIn: 'root' })
export class WorkspaceWebClient {
  private readonly route = '/api/workspaces';

  constructor(private readonly base: BaseWebClient) {}

  async getAll(page = 1, perPage = 20): Promise<PaginationDto<WorkspaceDto> | null> {
    return this.base.get<PaginationDto<WorkspaceDto>>(this.route, {
      params: { page, per_page: perPage },
    });
  }

  async getById(id: number): Promise<WorkspaceDto | null> {
    return this.base.get<WorkspaceDto>(`${this.route}/${id}`);
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

  async getFolders(
    id: number,
    page = 1,
    perPage = 20
  ): Promise<PaginationDto<FolderDto> | null> {
    return this.base.get<PaginationDto<FolderDto>>(
      `${this.route}/${id}/folders`,
      { params: { page, per_page: perPage } }
    );
  }
}
