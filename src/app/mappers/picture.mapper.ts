import { PictureDto } from '../dtos/picture.dto';
import { Picture } from '../models/picture.model';
import { mapTag } from './tag.mapper';

export function mapPicture(dto: PictureDto): Picture {
  return {
    id: dto.id,
    googleId: dto.google_id,
    name: dto.name,
    comment: dto.comment,
    tags: dto.tags.map(mapTag),
    mainColors: dto.mainColors,
    orientation: dto.orientation,
    ratio: dto.ratio,
    resolutionX: dto.resolutionX,
    resolutionY: dto.resolutionY,
    contrast: dto.contrast,
    luminosity: dto.luminosity,
    thumbnailUrl: dto.thumbnailLink,
    downloadUrl: dto.downloadLink,
    lastUpdated: dto.lastUpdated,
    datasourceId: dto.datasource_id,
  };
}
