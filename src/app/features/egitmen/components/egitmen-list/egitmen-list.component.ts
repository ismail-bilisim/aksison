import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';

@Component({
  selector: 'app-egitmen-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './egitmen-list.component.html',
  styleUrl: './egitmen-list.component.css'
})
export class EgitmenListComponent {
  @Input() egitmenler: EgitmenOzet[] = [];
  @Input() isLoading = false;

  @Output() view = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();

  onView(id: number): void {
    this.view.emit(id);
  }

  onEdit(id: number): void {
    this.edit.emit(id);
  }

  getOnayDurumuBadgeClass(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'bg-secondary';
      case 'ons': return 'bg-warning';
      case 'ony': return 'bg-success';
      case 'red': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getOnayDurumuText(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'Taslak';
      case 'ons': return 'Onay Bekliyor';
      case 'ony': return 'Onaylı';
      case 'red': return 'Reddedildi';
      default: return onayDurumu;
    }
  }
}
