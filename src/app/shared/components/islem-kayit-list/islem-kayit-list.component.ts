import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IslemKayit } from '../../../core/models/islem-kayit';

/**
 * Generic operation log list component (Dumb Component).
 * Following Single Responsibility Principle - only displays operation logs.
 * Following Dependency Inversion Principle - depends on abstraction (IslemKayitBase).
 * Performance optimized with OnPush change detection.
 */
@Component({
  selector: 'app-islem-kayit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './islem-kayit-list.component.html',
  styleUrls: ['./islem-kayit-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IslemKayitListComponent {
  /** List of operation logs to display */
  @Input() items: IslemKayit[] = [];
  
  /** Loading state indicator */
  @Input() isLoading = false;
  
  /** Optional title for the list */
  @Input() title = 'İşlem Kayıtları';
  
  /** Show or hide title */
  @Input() showTitle = true;
  
  /** Empty state message */
  @Input() emptyMessage = 'Henüz işlem kaydı bulunmamaktadır.';
  
  /** Table size control */
  @Input() tableSize: 'sm' | 'md' = 'sm';
  
  /** Use styled version (with badges, icons) */
  @Input() useStyledVersion = true;

  /**
   * Track by function for optimal *ngFor performance
   * Following Angular best practices
   */
  trackById(index: number, item: IslemKayit): number {
    return item.id;
  }
}
