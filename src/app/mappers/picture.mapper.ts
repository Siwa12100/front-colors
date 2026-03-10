import { PictureDto } from '../dtos/picture.dto';
import { Photo } from '../models';
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
    resolutionX: Number(dto.resolutionX),
    resolutionY: Number(dto.resolutionY),
    contrast: dto.contrast,
    luminosity: dto.luminosity,
    thumbnailUrl: dto.thumbnailLink,
    downloadUrl: dto.downloadLink,
    lastUpdated: dto.lastUpdated,
    datasourceId: dto.datasource_id,
  };
}

export function mapPhoto(dto: PictureDto): Photo {
  return {
    id: String(dto.id),
    name: dto.name,
    url: dto.thumbnailLink,
    thumbnailLink: dto.thumbnailLink,
    downloadLink: dto.downloadLink,
    tags: dto.tags.map(mapTag),
    // mainColors: dto.mainColors,
    //orientation: dto.orientation,
    //ratio: dto.ratio,
    size: dto.resolutionX * dto.resolutionY,
    width: dto.resolutionX ?? 50,
    height: dto.resolutionY,
    mainColors: dto.mainColors,
    //contrast: dto.contrast,
    //luminosity: dto.luminosity,

    createdAt: new Date(dto.lastUpdated),
    modifiedAt: new Date(dto.lastUpdated),
    source: {
      id: String(dto.datasource_id),
      type: 'google_drive',
      label: 'Google Drive',
      config: { folderId: String(dto.datasource_id), folderName: '' },
      status: 'connected',
    },
    folderId: undefined,
    workspaceId: String(1),
    driveFileId: String(dto.datasource_id),
  };
}