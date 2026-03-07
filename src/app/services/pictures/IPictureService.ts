import { Page } from '../../models/page.model';
import { Picture } from '../../models/picture.model';

export interface PictureSearchFilters {
  name?: string;
  orientation?: string;
  min_ratio?: number;
  max_ratio?: number;
  min_contrast?: number;
  max_contrast?: number;
  min_luminosity?: number;
  max_luminosity?: number;
  tag_ids?: string;
  color?: string;
}

export interface IPictureService {

  /** Returns paginated pictures with filters */
  search(filters?: PictureSearchFilters, page?: number, perPage?: number): Promise<Page<Picture>>;

  /** Returns picture by id */
  getById(id: number): Promise<Picture>;

  /** Updates picture */
  update(id: number, data: Partial<Picture>): Promise<Picture>;

  /** Upload from Google Drive */
  uploadFromDrive(): Promise<number>;
}
