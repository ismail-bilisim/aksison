import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaddeLogResponse } from '../../../core/models/madde-log-response';

/**
 * Prensip, Standart ve Süreç Adımı tarihçesi için ortak liste bileşeni.
 * OnPush change detection ile performans optimize edilmiştir.
 */

const ISLEM_TURU_LABELS: Record<string, string> = {
  'PRNEK': 'Ekleme',
  'PRNGN': 'Güncelleme',
  'PRNSL': 'Silme',
  'PRNMG': 'Mülga',
  'STDEK': 'Ekleme',
  'STDGN': 'Güncelleme',
  'STDSL': 'Silme',
  'STDMG': 'Mülga',
  'SADEK': 'Ekleme',
  'SADGN': 'Güncelleme',
  'SADSL': 'Silme',
  'SADMG': 'Mülga'
};

const ISLEM_TURU_BADGE: Record<string, string> = {
  'PRNEK': 'bg-success',
  'PRNGN': 'bg-primary',
  'PRNSL': 'bg-danger',
  'PRNMG': 'bg-dark',
  'STDEK': 'bg-success',
  'STDGN': 'bg-primary',
  'STDSL': 'bg-danger',
  'STDMG': 'bg-dark',
  'SADEK': 'bg-success',
  'SADGN': 'bg-primary',
  'SADSL': 'bg-danger',
  'SADMG': 'bg-dark'
};

const DURUM_LABELS: Record<string, string> = {
  'TASLK': 'Taslak',
  'YURUL': 'Yürürlükte',
  'MULGA': 'Mülga'
};

@Component({
  selector: 'app-tarihce-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarihce-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TarihceListComponent {
  @Input() items: MaddeLogResponse[] = [];
  @Input() isLoading = false;
  @Input() emptyMessage = 'Henüz tarihçe kaydı bulunmamaktadır.';

  trackById(index: number, item: MaddeLogResponse): number {
    return item.id;
  }

  getIslemTuruLabel(kod: string): string {
    return ISLEM_TURU_LABELS[kod] || kod;
  }

  getIslemTuruBadgeClass(kod: string): string {
    return ISLEM_TURU_BADGE[kod] || 'bg-secondary';
  }

  getDurumLabel(kod: string): string {
    return DURUM_LABELS[kod] || kod;
  }
}
