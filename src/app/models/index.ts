export interface Photo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  tags: string[];
  size: number; // bytes
  width: number;
  height: number;
  mimeType: string;
  createdAt: Date;
  modifiedAt: Date;
  source: PhotoSource;
  folderId?: string;
  workspaceId: string;
  driveFileId?: string;
}

export interface Folder {
  id: string;
  name: string;
  workspaceId: string;
  parentFolderId?: string;
  createdAt: Date;
  photoIds: string[];
  subFolderIds: string[];
  color?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  photoIds: string[];
  folderIds: string[];
  sources: PhotoSource[];
  coverPhotoUrl?: string;
}

export interface PhotoSource {
  id: string;
  type: 'google_drive' | 'local' | 'dropbox' | 'onedrive' | 'url';
  label: string;
  config: GoogleDriveConfig | LocalConfig | UrlConfig;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync?: Date;
  photoCount?: number;
}

export interface GoogleDriveConfig {
  folderId: string;
  folderName: string;
  accessToken?: string;
}

export interface LocalConfig {
  path: string;
}

export interface UrlConfig {
  endpoint: string;
  apiKey?: string;
}

export interface SearchFilters {
  tags: string[];
  dateFrom?: Date;
  dateTo?: Date;
  minWidth?: number;
  minHeight?: number;
  mimeTypes: string[];
  sources: string[];
  sizeMin?: number;
  sizeMax?: number;
}

export interface TechnicalDetails {
  photo: Photo;
  exif?: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    flash?: string;
    gps?: { lat: number; lng: number };
  };
}