import { Injectable, signal, computed } from '@angular/core';
import { Photo, Folder, Workspace, PhotoSource, SearchFilters } from '../models';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private _workspaces = signal<Workspace[]>(MOCK_WORKSPACES);
  private _photos = signal<Photo[]>(MOCK_PHOTOS);
  private _folders = signal<Folder[]>(MOCK_FOLDERS);
  private _activeWorkspaceId = signal<string>('ws-1');
  private _searchQuery = signal<string>('');
  private _filters = signal<SearchFilters>({ tags: [], mimeTypes: [], sources: [] });

  readonly workspaces = this._workspaces.asReadonly();
  readonly activeWorkspaceId = this._activeWorkspaceId.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly activeWorkspace = computed(() =>
    this._workspaces().find(w => w.id === this._activeWorkspaceId())
  );

  readonly workspacePhotos = computed(() => {
    const ws = this.activeWorkspace();
    if (!ws) return [];
    const query = this._searchQuery().toLowerCase();
    const filters = this._filters();

    return this._photos()
      .filter(p => p.workspaceId === ws.id)
      .filter(p => !p.folderId)
      .filter(p => {
        if (!query) return true;
        return (
          p.name.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query))
        );
      })
      .filter(p => {
        if (filters.tags.length === 0) return true;
        return filters.tags.every(t => p.tags.includes(t));
      })
      .filter(p => {
        if (filters.mimeTypes.length === 0) return true;
        return filters.mimeTypes.includes(p.mimeType);
      })
      .filter(p => {
        if (!filters.dateFrom) return true;
        return p.createdAt >= filters.dateFrom;
      })
      .filter(p => {
        if (!filters.dateTo) return true;
        return p.createdAt <= filters.dateTo;
      });
  });

  readonly workspaceFolders = computed(() => {
    const ws = this.activeWorkspace();
    if (!ws) return [];
    return this._folders().filter(f => f.workspaceId === ws.id && !f.parentFolderId);
  });

  readonly allTags = computed(() => {
    const ws = this.activeWorkspace();
    if (!ws) return [];
    const tags = new Set<string>();
    this._photos()
      .filter(p => p.workspaceId === ws.id)
      .forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  });

  setActiveWorkspace(id: string) {
    this._activeWorkspaceId.set(id);
    this._searchQuery.set('');
    this._filters.set({ tags: [], mimeTypes: [], sources: [] });
  }

  setSearchQuery(query: string) {
    this._searchQuery.set(query);
  }

  setFilters(filters: Partial<SearchFilters>) {
    this._filters.update(f => ({ ...f, ...filters }));
  }

  getPhotosInFolder(folderId: string): Photo[] {
    return this._photos().filter(p => p.folderId === folderId);
  }

  getSubFolders(parentId: string): Folder[] {
    return this._folders().filter(f => f.parentFolderId === parentId);
  }

  createFolder(name: string, workspaceId: string, parentFolderId?: string): Folder {
    const folder: Folder = {
      id: 'folder-' + Date.now(),
      name,
      workspaceId,
      parentFolderId,
      createdAt: new Date(),
      photoIds: [],
      subFolderIds: [],
      color: FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)]
    };
    this._folders.update(f => [...f, folder]);
    this._workspaces.update(ws =>
      ws.map(w => w.id === workspaceId ? { ...w, folderIds: [...w.folderIds, folder.id] } : w)
    );
    return folder;
  }

  addSource(workspaceId: string, source: PhotoSource) {
    this._workspaces.update(ws =>
      ws.map(w => w.id === workspaceId ? { ...w, sources: [...w.sources, source] } : w)
    );
  }

  removeSource(workspaceId: string, sourceId: string) {
    this._workspaces.update(ws =>
      ws.map(w => w.id === workspaceId
        ? { ...w, sources: w.sources.filter(s => s.id !== sourceId) }
        : w)
    );
  }

  createWorkspace(name: string, description?: string): Workspace {
    const ws: Workspace = {
      id: 'ws-' + Date.now(),
      name,
      description,
      createdAt: new Date(),
      photoIds: [],
      folderIds: [],
      sources: []
    };
    this._workspaces.update(list => [...list, ws]);
    return ws;
  }

  movePhotoToFolder(photoId: string, folderId: string | undefined) {
    this._photos.update(photos =>
      photos.map(p => p.id === photoId ? { ...p, folderId } : p)
    );
  }
}

const FOLDER_COLORS = ['#D97706', '#7C3AED', '#059669', '#DC2626', '#2563EB'];

const MOCK_PHOTOS: Photo[] = [
  {
    id: 'p1', name: 'Montagne dorée.jpg', url: 'https://picsum.photos/seed/mountain/1200/800',
    thumbnailLink: 'https://picsum.photos/seed/mountain/400/300',
    tags: ['nature', 'montagne', 'paysage', 'doré'], size: 2400000,
    width: 1200, height: 800, mimeType: 'image/jpeg',
    createdAt: new Date('2024-03-15'), modifiedAt: new Date('2024-03-15'),
    source: { id: 's1', type: 'google_drive', label: 'Drive Pro', config: { folderId: 'gf1', folderName: 'Photos Nature' }, status: 'connected' },
    workspaceId: 'ws-1', downloadLink: 'https://google.com'
  },
  {
    id: 'p2', name: 'Architecture urbaine.jpg', url: 'https://picsum.photos/seed/city/1200/900',
    thumbnailLink: 'https://picsum.photos/seed/city/400/300',
    tags: ['architecture', 'urbain', 'noir et blanc'], size: 3100000,
    width: 1200, height: 900, mimeType: 'image/jpeg',
    createdAt: new Date('2024-04-01'), modifiedAt: new Date('2024-04-01'),
    source: { id: 's1', type: 'google_drive', label: 'Drive Pro', config: { folderId: 'gf1', folderName: 'Photos Nature' }, status: 'connected' },
    workspaceId: 'ws-1', downloadLink: 'https://google.com'
  },
  {
    id: 'p3', name: 'Portrait lumière.jpg', url: 'https://picsum.photos/seed/portrait/900/1200',
    thumbnailLink: 'https://picsum.photos/seed/portrait/300/400',
    tags: ['portrait', 'lumière', 'studio'], size: 1800000,
    width: 900, height: 1200, mimeType: 'image/jpeg',
    createdAt: new Date('2024-04-10'), modifiedAt: new Date('2024-04-10'),
    source: { id: 's1', type: 'google_drive', label: 'Drive Pro', config: { folderId: 'gf1', folderName: 'Photos Nature' }, status: 'connected' },
    workspaceId: 'ws-1', downloadLink: 'https://google.com'
  },
  {
    id: 'p4', name: 'Forêt mystique.jpg', url: 'https://picsum.photos/seed/forest/1200/800',
    thumbnailLink: 'https://picsum.photos/seed/forest/400/300',
    tags: ['nature', 'forêt', 'brume'], size: 2900000,
    width: 1200, height: 800, mimeType: 'image/jpeg',
    createdAt: new Date('2024-04-20'), modifiedAt: new Date('2024-04-20'),
    source: { id: 's2', type: 'google_drive', label: 'Drive Personnel', config: { folderId: 'gf2', folderName: 'Voyages' }, status: 'connected' },
    workspaceId: 'ws-1', downloadLink: 'https://google.com'
  },
  {
    id: 'p5', name: 'Ocean bleu.jpg', url: 'https://picsum.photos/seed/ocean/1400/900',
    thumbnailLink: 'https://picsum.photos/seed/ocean/400/260',
    tags: ['mer', 'nature', 'paysage', 'bleu'], size: 3400000,
    width: 1400, height: 900, mimeType: 'image/jpeg',
    createdAt: new Date('2024-05-01'), modifiedAt: new Date('2024-05-01'),
    source: { id: 's2', type: 'google_drive', label: 'Drive Personnel', config: { folderId: 'gf2', folderName: 'Voyages' }, status: 'connected' },
    workspaceId: 'ws-1', downloadLink: 'https://google.com'
  },
  {
    id: 'p6', name: 'Abstract rouge.png', url: 'https://picsum.photos/seed/abstract/1000/1000',
    thumbnailLink: 'https://picsum.photos/seed/abstract/300/300',
    tags: ['art', 'abstrait', 'rouge'], size: 4100000,
    width: 1000, height: 1000, mimeType: 'image/png',
    createdAt: new Date('2024-05-12'), modifiedAt: new Date('2024-05-12'),
    source: { id: 's1', type: 'google_drive', label: 'Drive Pro', config: { folderId: 'gf1', folderName: 'Photos Nature' }, status: 'connected' },
    workspaceId: 'ws-1', downloadLink: 'https://google.com'
  },
  {
    id: 'p7', name: 'Café matin.jpg', url: 'https://picsum.photos/seed/coffee/800/600',
    thumbnailLink: 'https://picsum.photos/seed/coffee/400/300',
    tags: ['lifestyle', 'café', 'matin'], size: 1200000,
    width: 800, height: 600, mimeType: 'image/jpeg',
    createdAt: new Date('2024-05-20'), modifiedAt: new Date('2024-05-20'),
    source: { id: 's1', type: 'google_drive', label: 'Drive Pro', config: { folderId: 'gf1', folderName: 'Photos Nature' }, status: 'connected' },
    workspaceId: 'ws-2', downloadLink: 'https://google.com'
  },
  {
    id: 'p8', name: 'Sunset tropical.jpg', url: 'https://picsum.photos/seed/sunset/1600/900',
    thumbnailLink: 'https://picsum.photos/seed/sunset/400/225',
    tags: ['coucher de soleil', 'tropical', 'paysage'], size: 5200000,
    width: 1600, height: 900, mimeType: 'image/jpeg',
    createdAt: new Date('2024-06-01'), modifiedAt: new Date('2024-06-01'),
    source: { id: 's3', type: 'url', label: 'API Unsplash', config: { endpoint: 'https://api.unsplash.com' }, status: 'connected' },
    workspaceId: 'ws-2', downloadLink: 'https://google.com'
  },
];

const MOCK_FOLDERS: Folder[] = [
  {
    id: 'f1', name: 'Paysages', workspaceId: 'ws-1', createdAt: new Date('2024-03-01'),
    photoIds: [], subFolderIds: [], color: '#D97706'
  },
  {
    id: 'f2', name: 'Portraits', workspaceId: 'ws-1', createdAt: new Date('2024-03-10'),
    photoIds: [], subFolderIds: [], color: '#7C3AED'
  },
];

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1', name: 'Projet Nature', description: 'Photos de paysages et nature sauvage',
    createdAt: new Date('2024-01-15'), photoIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
    folderIds: ['f1', 'f2'],
    coverPhotoUrl: 'https://picsum.photos/seed/mountain/400/300',
    sources: [
      { id: 's1', type: 'google_drive', label: 'Drive Pro', config: { folderId: 'gf1', folderName: 'Photos Nature' }, status: 'connected', lastSync: new Date(), photoCount: 247 },
      { id: 's2', type: 'google_drive', label: 'Drive Personnel', config: { folderId: 'gf2', folderName: 'Voyages' }, status: 'syncing', photoCount: 89 }
    ]
  },
  {
    id: 'ws-2', name: 'Lifestyle & Food', description: 'Photos culinaires et style de vie',
    createdAt: new Date('2024-02-01'), photoIds: ['p7', 'p8'],
    folderIds: [],
    coverPhotoUrl: 'https://picsum.photos/seed/coffee/400/300',
    sources: [
      { id: 's3', type: 'url', label: 'API Unsplash', config: { endpoint: 'https://api.unsplash.com' }, status: 'connected', photoCount: 512 }
    ]
  },
  {
    id: 'ws-3', name: 'Architecture', description: 'Photographies architecturales',
    createdAt: new Date('2024-03-05'), photoIds: [],
    folderIds: [],
    coverPhotoUrl: 'https://picsum.photos/seed/city/400/300',
    sources: []
  },
];