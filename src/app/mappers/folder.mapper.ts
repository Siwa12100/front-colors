import { FolderDto } from '../dtos/folder.dto';
import { Folder } from '../models/folder.model';

export function mapFolder(dto: FolderDto): Folder {
  return {
    id: dto.id,
    name: dto.name,
    workspaceId: dto.workspace_id,
    parentFolderId: dto.parent_folder_id,
    pictureIds: dto.pictures,
  };
}
