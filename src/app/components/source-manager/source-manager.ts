import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoSource, Workspace } from '../../models';
import { IPictureService } from '../../services/pictures/IPictureService';
import { PICTURE_SERVICE } from '../../core/di-tokens/picture.token';

type SourceType = 'google_drive' | 'dropbox' | 'onedrive' | 'url';

@Component({
  selector: 'app-source-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './source-manager.html',
  styleUrls: ['./source-manager.css']
})
export class SourceManagerComponent {

  private pictureService = inject(PICTURE_SERVICE) as IPictureService;
  
  workspace = input.required<Workspace>();
  addSource = output<PhotoSource>();
  
  removeSource = output<string>();

  showAddForm = signal(false);
  selectedType = signal<SourceType>('google_drive');

  toggleAddForm() { this.showAddForm.update(v => !v); }
  cancelAddForm() { this.showAddForm.set(false); }
  setSourceType(type: SourceType) { this.selectedType.set(type); }
  onLabelChange(val: string) { this.label.set(val); }
  onDriveFolderChange(val: string) { this.driveFolder.set(val); }
  onDriveIdChange(val: string) { this.driveId.set(val); }
  onApiEndpointChange(val: string) { this.apiEndpoint.set(val); }
  onApiKeyChange(val: string) { this.apiKey.set(val); }
  label = signal('');
  driveFolder = signal('');
  driveId = signal('');
  apiEndpoint = signal('');
  apiKey = signal('');

  sourceTypes: { value: SourceType; label: string; icon: string }[] = [
    { value: 'google_drive', label: 'Google Drive', icon: '🔵' },
    { value: 'dropbox', label: 'Dropbox', icon: '📦' },
    { value: 'onedrive', label: 'OneDrive', icon: '☁️' },
    { value: 'url', label: 'API / URL', icon: '🔗' },
  ];

  statusLabels: Record<string, string> = {
    connected: 'Connecté',
    disconnected: 'Déconnecté',
    syncing: 'Synchronisation...',
    error: 'Erreur',
  };

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      connected: 'status-ok',
      syncing: 'status-sync',
      error: 'status-error',
      disconnected: 'status-off',
    };
    return map[status] ?? '';
  }

  submit() {
    if (!this.label()) return;

    const config: any = this.selectedType() === 'url'
      ? { endpoint: this.apiEndpoint(), apiKey: this.apiKey() }
      : { folderId: this.driveId(), folderName: this.driveFolder() };

    const source: PhotoSource = {
      id: 'src-' + Date.now(),
      type: this.selectedType(),
      label: this.label(),
      config,
      status: 'disconnected',
    };

    this.addSource.emit(source);
    this.showAddForm.set(false);
    this.label.set('');
    this.driveFolder.set('');
    this.driveId.set('');
    this.apiEndpoint.set('');
    this.apiKey.set('');
  }

  formatDate(d: Date): string {
    if (!d) return 'Jamais';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}