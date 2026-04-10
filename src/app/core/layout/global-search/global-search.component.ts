import { Component, OnDestroy, ViewChild, ElementRef, TemplateRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GlobalSearchService } from '../../services/api/global-search.service';
import { GlobalSearchResult } from '../../models/global-search-result';

const ENTITY_LABELS: Record<string, string> = {
  DERS: 'Ders',
  VIDEODERS: 'Video Ders',
  YUZYUZEDERS: 'Yüz Yüze Ders',
  CANLIDERS: 'Canlı Ders',
  PROSEDUR: 'Prosedür',
  ETKINLIK: 'Etkinlik'
};

const ENTITY_ROUTES: Record<string, string> = {
  DERS: '/ders/detail',
  VIDEODERS: '/videoders/detail',
  YUZYUZEDERS: '/yuzyuzeders/detail',
  CANLIDERS: '/canliders/detail',
  PROSEDUR: '/prosedur/detail',
  ETKINLIK: '/etkinlikorganizasyon/detail'
};

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnDestroy {
  @ViewChild('searchModalTpl') searchModalTpl!: TemplateRef<unknown>;
  @ViewChild('searchInput') searchInputEl!: ElementRef<HTMLInputElement>;

  searchControl = new FormControl('');
  results: GlobalSearchResult[] = [];
  isLoading = false;
  hasSearched = false;
  focusedIndex = -1;

  private readonly destroy$ = new Subject<void>();
  private activeModal?: NgbModalRef;

  constructor(
    private readonly modalService: NgbModal,
    private readonly globalSearchService: GlobalSearchService,
    private readonly router: Router
  ) {}

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  openSearch(): void {
    if (this.activeModal) { return; }
    this.activeModal = this.modalService.open(this.searchModalTpl, {
      windowClass: 'global-search-window',
      backdropClass: 'global-search-backdrop',
      centered: false,
      keyboard: true
    });
    this.activeModal.shown.subscribe(() => {
      this.searchInputEl?.nativeElement.focus();
      this.setupSearch();
    });
    this.activeModal.hidden.subscribe(() => {
      this.cleanup();
      this.activeModal = undefined;
    });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(value => {
        if (!value || value.trim().length < 3) {
          this.results = [];
          this.hasSearched = false;
          this.isLoading = false;
          this.focusedIndex = -1;
        }
      }),
      filter((value): value is string => !!value && value.trim().length >= 3),
      tap(() => { this.isLoading = true; this.focusedIndex = -1; }),
      switchMap(value => this.globalSearchService.search(value)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (results) => {
        this.results = results;
        this.isLoading = false;
        this.hasSearched = true;
      },
      error: () => {
        this.results = [];
        this.isLoading = false;
        this.hasSearched = true;
      }
    });
  }

  private cleanup(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.results = [];
    this.hasSearched = false;
    this.isLoading = false;
    this.focusedIndex = -1;
    this.destroy$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.results = [];
    this.hasSearched = false;
    this.focusedIndex = -1;
    this.searchInputEl?.nativeElement.focus();
  }

  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusedIndex = Math.min(this.focusedIndex + 1, this.results.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex = Math.max(this.focusedIndex - 1, -1);
      if (this.focusedIndex === -1) { this.searchInputEl?.nativeElement.focus(); }
    } else if (event.key === 'Enter' && this.focusedIndex >= 0) {
      event.preventDefault();
      this.onResultSelected(this.results[this.focusedIndex]);
    }
  }

  getEntityLabel(entityType: string): string {
    return ENTITY_LABELS[entityType] || entityType;
  }

  getDisplayText(result: GlobalSearchResult): string {
    const parts: string[] = [];
    if (result.kodu) { parts.push(String(result.kodu)); }
    parts.push(result.adi);
    return parts.join(' - ');
  }

  onResultSelected(result: GlobalSearchResult): void {
    this.activeModal?.close();
    const basePath = ENTITY_ROUTES[result.entityType];
    if (basePath) {
      this.router.navigate([basePath, result.id]);
    }
  }
}
