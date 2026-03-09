import { Injectable } from '@angular/core';
import { FolderWebClient } from '../../core/http/web-clients/folder.web-client';
import { IFolderService } from './IFolderService';
import { mapFolder } from '../../mappers/folder.mapper';
import { mapPicture } from '../../mappers/picture.mapper';
import { mapPagination } from '../../mappers/pagination.mapper';

@Injectable({
  providedIn: 'root',
})
export class FolderService implements IFolderService {

  constructor(private readonly client: FolderWebClient) { }

  async getById(id: number) {
    const dto = await this.client.getById(id);
    if (!dto) throw new Error('Folder not found');
    return mapFolder(dto);
  }

  async getPictures(id: number, page = 1, perPage = 20) {
    const dto = await this.client.getPictures(id, page, perPage);
    if (!dto) throw new Error('Failed to load pictures');
    return mapPagination(dto, mapPicture);
  }

  async getChildren(id: number) {
    const dto = await this.client.getChildren(id);
    if (!dto) throw new Error('Failed to load children');
    return dto.data.map(mapFolder);
  }

  async create(name: string, workspaceId: number, parentId?: number | null) {
    const dto = await this.client.create({
      name,
      workspace_id: workspaceId,
      parent_folder_id: parentId ?? null,
    });
    if (!dto) throw new Error('Failed to create folder');
    return mapFolder(dto);
  }


  async removePicture(folderId: number, pictureId: number) {
    const folder = await this.getById(folderId);
    console.log("folder : " + folder);
    const currentIds = (folder.pictureIds ?? []).map(Number);
    const nextIds = currentIds.filter(id => id !== pictureId);

    const dto = await this.client.update(folderId, { pictures: nextIds } as any);
    if (!dto) throw new Error('Failed to remove picture from folder');
    return mapFolder(dto);
  }


  async update(id: number, data: any) {
    const dto = await this.client.update(id, {
      name: data.name,
      parent_folder_id: data.parentFolderId,
    });
    if (!dto) throw new Error('Failed to update folder');
    return mapFolder(dto);
  }

  async delete(id: number) {
    await this.client.delete(id);
  }

  async addPicture(folderId: number, currentPictureIds: number[], newPictureId: number) {
    const dto = await this.client.update(folderId, {
      pictures: [...currentPictureIds, newPictureId]
    });
    if (!dto) throw new Error('Failed to add picture to folder');
    return mapFolder(dto);
  }
}
