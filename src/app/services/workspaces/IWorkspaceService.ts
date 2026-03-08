import { Workspace } from '../../models/workspace.model';
import { Page } from '../../models/page.model';
import { Folder } from '../../models/folder.model';
import { Picture } from '../../models/picture.model';

export interface IWorkspaceService {

  /** Returns paginated user workspaces */
  getAll(userId: number, page?: number, perPage?: number): Promise<Page<Workspace>>;

  /** Returns workspace by id */
  getById(id: number): Promise<Workspace>;

  /** Returns folders of workspace */
  getFolders(id: number, page?: number, perPage?: number): Promise<Page<Folder>>;

  /** Returns pictures of workspace */
  getPictures(id: number, page?: number, perPage?: number): Promise<Page<Picture>>;

  /** Updates workspace */
  update(id: number, data: Partial<Workspace>): Promise<Workspace>;
}
