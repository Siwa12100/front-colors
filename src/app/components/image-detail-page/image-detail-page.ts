import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../../models';

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
    a.href = this.photo().url;
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