import { TagDto } from './tag.dto';

export interface PictureDto {
  id: number;
  google_id: string;
  name: string;
  comment: string | null;
  tags: TagDto[];
  mainColors: string[];
  orientation: 'landscape' | 'portrait' | 'square';
  ratio: number;
  resolutionX: number;
  resolutionY: number;
  contrast: number;
  luminosity: number;
  thumbnailLink: string;
  downloadLink: string;
  lastUpdated: string;
  datasource_id: number;
}
