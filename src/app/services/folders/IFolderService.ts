import { Folder } from '../../models/folder.model';
import { Page } from '../../models/page.model';
import { Picture } from '../../models/picture.model';

export interface IFolderService {

  /** Returns folder by id */
  getById(id: number): Promise<Folder>;

  /** Returns paginated pictures of folder */
  getPictures(id: number, page?: number, perPage?: number): Promise<Page<Picture>>;

  /** Returns children folders */
  getChildren(id: number): Promise<Folder[]>;

  /** Creates a folder */
  create(name: string, workspaceId: number, parentId?: number | null): Promise<Folder>;

  /** Updates a folder */
  update(id: number, data: Partial<Folder>): Promise<Folder>;

  /** Deletes a folder */
  delete(id: number): Promise<void>;
}
