import { Tag } from '../../models/tag.model';
import { Page } from '../../models/page.model';

export interface ITagService {
  /** Returns paginated tags */
  getAll(page?: number, perPage?: number): Promise<Page<Tag>>;

  /** Creates a new tag */
  create(name: string, hex_code: string): Promise<Tag>;

  /** Updates an existing tag */
  update(id: number, data: Partial<Tag>): Promise<Tag>;

  /** Deletes a tag */
  delete(id: number): Promise<void>;

  /** Finds tag by name */
  findByName(name: string): Promise<Tag | undefined>;
}
