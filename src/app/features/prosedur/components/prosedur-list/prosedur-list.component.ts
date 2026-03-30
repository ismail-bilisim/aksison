import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProsedurOzet } from 'src/app/core/models/prosedur-ozet';
import { PROSEDUR_DURUM_BADGE_CLASS } from 'src/app/core/models/prosedur-durumu.enum';

@Component({
  selector: 'app-prosedur-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prosedur-list.component.html'
})
export class ProsedurListComponent {
  @Input() prosedurler: ProsedurOzet[] = [];
  @Output() viewDetail = new EventEmitter<number>();

  getBadgeClass(durumKodu: string): string {
    return PROSEDUR_DURUM_BADGE_CLASS[durumKodu] || 'bg-secondary';
  }

  onViewDetail(id: number): void {
    this.viewDetail.emit(id);
  }
}
