import { Tag } from './tag.model';

export interface Picture {
  id: number;
  googleId: string;
  name: string;
  comment: string | null;
  tags: Tag[];
  mainColors: string[];
  orientation: 'landscape' | 'portrait' | 'square';
  ratio: number;
  resolutionX: number;
  resolutionY: number;
  contrast: number;
  luminosity: number;
  thumbnailUrl: string;
  downloadUrl: string;
  lastUpdated: string;
  datasourceId: number;
}
