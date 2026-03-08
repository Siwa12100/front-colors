import { Component, computed, signal, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../services/workspace-service';
import { SearchFilters } from '../../models';
import { TagService } from '../../services/tags/tag.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBarComponent {
  private svc = inject(WorkspaceService);
  private tagService = inject(TagService);
  private elRef = inject(ElementRef);

  searchQuery = signal('');
  showFilters = signal(false);
  showTagSuggestions = signal(false);

  toggleFilters() { this.showFilters.update(v => !v); }
  closeFilters() { this.showFilters.set(false); }
  openTagSuggestions() { this.showTagSuggestions.set(true); }
  onDateFromChange(val: string) { this.dateFrom.set(val); this.applyFilters(); }
  onDateToChange(val: string) { this.dateTo.set(val); this.applyFilters(); }

  selectedTags = signal<string[]>([]);
  selectedMimeTypes = signal<string[]>([]);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  sizeMin = signal<string>('');
  sizeMax = signal<string>('');

  allTags = signal<string[]>([]);

  constructor(){
    this.loadTags();
  }
  async loadTags(){
    try {
      const result = await this.tagService.getAll(1, 1000);
      this.allTags.set(result.items.map((t: any) => t.name));
    }
    catch{}
  }

  filteredTagSuggestions = computed(() => {
    const query = this.searchQuery().slice(1).toLowerCase(); // ne pas prendre en compte le #
    if (!query) return this.allTags().slice(0, 8);
    return this.allTags().filter(t => t.toLowerCase().includes(query) && !this.selectedTags().includes(t)).slice(0, 6);
  });

  hasActiveFilters = computed(() =>
    this.selectedTags().length > 0 ||
    this.selectedMimeTypes().length > 0 ||
    !!this.dateFrom() || !!this.dateTo()
  );

  mimeTypeOptions = [
    { value: 'image/jpeg', label: 'JPEG' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/gif', label: 'GIF' },
    { value: 'image/webp', label: 'WebP' },
    { value: 'image/svg+xml', label: 'SVG' },
  ];

  onQueryChange(query: string) {
    this.searchQuery.set(query);
    this.svc.setSearchQuery(query);
    if (query == "" || query.startsWith("#")){
      this.showTagSuggestions.set(true);
    }
    else{
      this.showTagSuggestions.set(false);
    }
  }

  selectTag(tag: string) {
    if (!this.selectedTags().includes(tag)) {
      this.selectedTags.update(t => [...t, tag]);
      this.applyFilters();
    }
    this.searchQuery.set('');
    this.svc.setSearchQuery('');
    this.showTagSuggestions.set(false);
  }

  removeTag(tag: string) {
    this.selectedTags.update(t => t.filter(x => x !== tag));
    this.applyFilters();
  }

  toggleMimeType(mime: string) {
    this.selectedMimeTypes.update(types =>
      types.includes(mime) ? types.filter(t => t !== mime) : [...types, mime]
    );
    this.applyFilters();
  }

  applyFilters() {
    this.svc.setFilters({
      tags: this.selectedTags(),
      mimeTypes: this.selectedMimeTypes(),
      dateFrom: this.dateFrom() ? new Date(this.dateFrom()) : undefined,
      dateTo: this.dateTo() ? new Date(this.dateTo()) : undefined,
    });
  }

  clearAll() {
    this.selectedTags.set([]);
    this.selectedMimeTypes.set([]);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.searchQuery.set('');
    this.svc.setSearchQuery('');
    this.svc.setFilters({ tags: [], mimeTypes: [], sources: [] });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    if (!this.elRef.nativeElement.contains(e.target)) {
      this.showTagSuggestions.set(false);
      this.showFilters.set(false);
    }
  }
}