import { TagDto } from './tag.dto';

export interface PictureDto {
  id: number;
  google_id: string;
  name: string;
  comment: string | null;
  tags: TagDto[];
  thumbnailLink: string;
  downloadLink: string;
  lastUpdated: string;
  datasource_id: number;
}
