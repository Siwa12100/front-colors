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

  selectedColors= signal<string[]>([]);
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
    this.selectedColors().length > 0 ||
    !!this.dateFrom() || !!this.dateTo()
  );

  colorsOptions = [
    { value: 'red', label: 'rouge' },
    { value: 'orange', label: 'orange' },
    { value: 'yellow', label: 'jaune' },
    { value: 'green', label: 'vert' },
    { value: 'cyan', label: 'cyan' },
    { value: 'blue', label: 'bleu' },
    { value: 'purple', label: 'violet' },
    { value: 'pink', label: 'rose' },
    { value: 'white', label: 'blanc' },
    { value: 'grey', label: 'gris' },
    { value: 'black', label: 'noir' },
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

  toggleColor(color: string) {
    this.selectedColors.update(types =>
      types.includes(color) ? types.filter(t => t !== color) : [...types, color]
    );
    this.applyFilters();
  }

  applyFilters() {
    this.svc.setFilters({
      tags: this.selectedTags().map(t => t.name),
      mainColors: this.selectedColors(),
      dateFrom: this.dateFrom() ? new Date(this.dateFrom()) : undefined,
      dateTo: this.dateTo() ? new Date(this.dateTo()) : undefined,
    });
  }

  clearAll() {
    this.selectedTags.set([]);
    this.selectedColors.set([]);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.searchQuery.set('');
    this.svc.setSearchQuery('');
    this.svc.setFilters({ tags: [], mainColors: [], sources: [] });
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
    if (this.selectedColors().length) params['mainColors'] = this.selectedColors().join(',');

    // Still update local state for client-side filtering
    this.svc.setFilters({
      tags: this.selectedTags().map(t => t.name),
      mainColors: this.selectedColors(),
      dateFrom: this.dateFrom() ? new Date(this.dateFrom()) : undefined,
      dateTo: this.dateTo() ? new Date(this.dateTo()) : undefined,
    });

    this.filtersApplied.emit(params);
    this.showFilters.set(false);
  }
}