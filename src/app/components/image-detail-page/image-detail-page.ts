import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../../models';
import { WorkspaceService } from '../../services/workspace-service';
import { TagService } from '../../services/tags/tag.service';
import { Tag } from '../../models/tag.model';
import { ImagesService } from '../../services/images-service';

@Component({
  selector: 'app-image-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-detail-page.html',
  styleUrls: ['./image-detail-page.css']
})


export class ImageDetailPageComponent {
  photo = input.required<Photo>();
  close = output<void>();
  svc = inject(WorkspaceService);

  zoom = signal(1);
  showTechnicalDetails = signal(false);
  activeTab = signal<'overview' | 'technical'>('overview');

  toggleTechnicalDetails() { this.showTechnicalDetails.update(v => !v); }
  setTabOverview() { this.activeTab.set('overview'); }
  setTabTechnical() { this.activeTab.set('technical'); }

  zoomIn() { this.zoom.update(z => Math.min(z + 0.25, 3)); }
  zoomOut() { this.zoom.update(z => Math.max(z - 0.25, 0.5)); }
  resetZoom() { this.zoom.set(1); }

  downloadPhoto() {
    const a = document.createElement('a');
    a.href = this.photo().downloadLink;
    a.download = this.photo().name;
    a.target = '_blank';
    a.click();
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatDate(d: Date): string {
    return new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  get sourceTypeLabel(): string {
    const labels: Record<string, string> = {
      google_drive: 'Google Drive',
      local: 'Local',
      dropbox: 'Dropbox',
      onedrive: 'OneDrive',
      url: 'API'
    };
    return labels[this.photo().source.type] ?? this.photo().source.type;
  }

  showAddTag = signal(false);
  newTagName = signal('');
  newTagColor = signal('#FF5733');

  toggleAddTag() { this.showAddTag.update(v => !v); }
  onTagNameChange(val: string) { this.newTagName.set(val); }
  onTagColorChange(val: string) { this.newTagColor.set(val); }

  imagesService = inject(ImagesService);

  localTags = signal<Tag[]>([]);

  async ngOnInit() {
    const result = await this.tagService.getAll(1, 1000);
    this.localTags.set(this.photo().tags);
    this.allTags.set(result.items);
  }

  async addTag() {
    if (!this.newTagName()) return;

    try {
      let tag = await this.tagService.findByName(this.newTagName());
      if (!tag) {
        tag = await this.tagService.create(this.newTagName(), this.newTagColor());
      }

      const currentTagIds = this.localTags().map(t => t.id);
      if (currentTagIds.includes(tag.id)) return;

      await this.imagesService.updateImage(Number(this.photo().id), {
        tags: [...currentTagIds, tag.id] as any,
      });

      this.localTags.update(tags => [...tags, tag!]);
      this.newTagName.set('');
      this.showAddTag.set(false);
    } catch (err) {
      console.error('Erreur ajout tag:', err);
    }
  }

  async removeTag(tag: Tag) {
    try {
      const currentTagIds = this.localTags().filter(t => t.id !== tag.id).map(t => t.id);
      await this.imagesService.updateImage(Number(this.photo().id), {
        tags: currentTagIds as any,
      });
      this.localTags.update(tags => tags.filter(t => t.id !== tag.id));
    } catch (err) {
      console.error('Erreur suppression tag:', err);
    }
  }

  tagService = inject(TagService);
  allTags = signal<Tag[]>([]);

  filteredTags = computed(() => {
    const query = this.newTagName().toLowerCase();
    if (!query) return this.allTags();
    return this.allTags().filter(t => t.name.toLowerCase().includes(query));
  });

  selectTag(tag: Tag) {
    this.newTagName.set(tag.name);
    this.newTagColor.set(tag.hex_code);
  }

  mockExif = {
    camera: 'Sony A7 IV',
    lens: 'FE 24-70mm f/2.8 GM',
    focalLength: '35mm',
    aperture: 'f/4.0',
    shutterSpeed: '1/250s',
    iso: 'ISO 400',
    flash: 'Désactivé',
  };
}