import { WorkspaceDto } from '../dtos/workspace.dto';
import { Workspace } from '../models/workspace.model';

export function mapWorkspace(dto: WorkspaceDto): Workspace {
  return {
    id: dto.id,
    userId: dto.user_id,
    name: dto.name,
    isSystem: dto.isSystem,
    favorites: dto.favorites,
    sources: dto.sources,
  };
}
