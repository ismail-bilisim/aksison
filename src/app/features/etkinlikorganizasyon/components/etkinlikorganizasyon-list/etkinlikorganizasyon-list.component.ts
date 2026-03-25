import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtkinlikOrganizasyonOzet } from 'src/app/core/models/etkinlik-organizasyon-ozet';
import { ETKINLIK_DURUM_BADGE_CLASS } from 'src/app/core/models/etkinlik-durumu.enum';

@Component({
  selector: 'app-etkinlikorganizasyon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etkinlikorganizasyon-list.component.html'
})
export class EtkinlikOrganizasyonListComponent {
  @Input() etkinlikler: EtkinlikOrganizasyonOzet[] = [];
  @Output() viewDetail = new EventEmitter<number>();

  getBadgeClass(durumKodu: string): string {
    return ETKINLIK_DURUM_BADGE_CLASS[durumKodu] || 'bg-secondary';
  }

  onViewDetail(id: number): void {
    this.viewDetail.emit(id);
  }
}
