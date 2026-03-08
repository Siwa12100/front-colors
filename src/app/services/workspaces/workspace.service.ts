import { Injectable } from '@angular/core';
import { WorkspaceWebClient } from '../../core/http/web-clients/workspace.web-client';
import { IWorkspaceService } from './IWorkspaceService';
import { mapWorkspace } from '../../mappers/workspace.mapper';
import { mapFolder } from '../../mappers/folder.mapper';
import { mapPicture } from '../../mappers/picture.mapper';
import { mapPagination } from '../../mappers/pagination.mapper';

@Injectable()
export class WorkspaceService implements IWorkspaceService {

  constructor(private readonly client: WorkspaceWebClient) {}

  async getAll(userId: number, page = 1, perPage = 20) {
    const dto = await this.client.getAll(userId, page, perPage);
    if (!dto) throw new Error('Failed to load workspaces');
    return mapPagination(dto, mapWorkspace);
  }

  async getById(id: number) {
    const dto = await this.client.getById(id);
    if (!dto) throw new Error('Workspace not found');
    return mapWorkspace(dto);
  }

  async getFolders(id: number, page = 1, perPage = 20) {
    const dto = await this.client.getFolders(id, page, perPage);
    if (!dto) throw new Error('Failed to load folders');
    return mapPagination(dto, mapFolder);
  }

  async getPictures(id: number, page = 1, perPage = 20) {
    const dto = await this.client.getPictures(id, page, perPage);
    if (!dto) throw new Error('Failed to load pictures');
    return mapPagination(dto, mapPicture);
  }

  async update(id: number, data: any) {
    const dto = await this.client.update(id, {
      name: data.name,
    });
    if (!dto) throw new Error('Failed to update workspace');
    return mapWorkspace(dto);
  }
}
