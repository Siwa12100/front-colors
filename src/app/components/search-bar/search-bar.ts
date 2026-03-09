import { Component, computed, signal, inject, HostListener, ElementRef, output } from '@angular/core';
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

  selectedMimeTypes = signal<string[]>([]);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  sizeMin = signal<string>('');
  sizeMax = signal<string>('');

  allTags = signal<{ id: number, name: string }[]>([]);
  selectedTags = signal<{ id: number, name: string }[]>([]);

  ngOnInit() {
    this.clearAll();
  }

  constructor() {
    this.loadTags();
  }

  async loadTags() {
    try {
      const result = await this.tagService.getAll(1, 1000);
      this.allTags.set(result.items.map((t: any) => ({ id: t.id, name: t.name })));
    } catch { }
  }

  filteredTagSuggestions = computed(() => {
    const query = this.searchQuery().slice(1).toLowerCase();
    if (!query) return this.allTags().slice(0, 8);
    return this.allTags()
      .filter(t => t.name.toLowerCase().includes(query) && !this.selectedTags().some(s => s.id === t.id))
      .slice(0, 6);
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
    if (query == "" || query.startsWith("#")) {
      this.showTagSuggestions.set(true);
    }
    else {
      this.showTagSuggestions.set(false);
    }
  }

  selectTag(tag: { id: number, name: string }) {
    if (!this.selectedTags().some(t => t.id === tag.id)) {
      this.selectedTags.update(t => [...t, tag]);
    }
    this.searchQuery.set('');
    this.svc.setSearchQuery('');
    this.showTagSuggestions.set(false);
  }

  removeTag(tag: { id: number, name: string }) {
    this.selectedTags.update(t => t.filter(x => x.id !== tag.id));
  }

  toggleMimeType(mime: string) {
    this.selectedMimeTypes.update(types =>
      types.includes(mime) ? types.filter(t => t !== mime) : [...types, mime]
    );
    this.applyFilters();
  }

  applyFilters() {
    this.svc.setFilters({
      tags: this.selectedTags().map(t => t.name),
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

  filtersApplied = output<Record<string, any>>();

  submitFilters() {
    console.log("Valider filtres")
    console.log("selectedTags au clic:", this.selectedTags());
    const params: Record<string, any> = {};

    if (this.searchQuery()) params['name'] = this.searchQuery();
    if (this.selectedTags().length) params['tags'] = this.selectedTags().map(t => t.id).join(',');
    console.log("Param : " + params["tags"])
    if (this.dateFrom()) params['updated_after'] = this.dateFrom();
    if (this.selectedMimeTypes().length) params['mime_types'] = this.selectedMimeTypes().join(',');

    // Still update local state for client-side filtering
    this.svc.setFilters({
      tags: this.selectedTags().map(t => t.name),
      mimeTypes: this.selectedMimeTypes(),
      dateFrom: this.dateFrom() ? new Date(this.dateFrom()) : undefined,
      dateTo: this.dateTo() ? new Date(this.dateTo()) : undefined,
    });

    this.filtersApplied.emit(params);
    this.showFilters.set(false);
  }
}