import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DersResponse } from 'src/app/core/models/ders-response';
import { OnayDurumuHelper } from 'src/app/core/models/onay-durumu.enum';

@Component({
  selector: 'app-ders-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-temel.component.html',
  styleUrls: ['./ders-temel.component.css']
})
export class DersTemelComponent {
  @Input() ders?: DersResponse;

  get tahminiDersSuresiFormatli(): string {
    const dak = this.ders?.tahminiDersSuresi;
    if (!dak || isNaN(dak) || dak < 0) return '';
    const saat = Math.floor(dak / 60);
    const dakika = dak % 60;
    return `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}`;
  }

  /**
   * Get OnayDurumu description for display
   */
  getOnayDurumuText(): string {
    return OnayDurumuHelper.getText(this.ders?.onayDurumu);
  }

  /**
   * Get OnayDurumu badge CSS class
   */
  getOnayDurumuBadge(): string {
    return OnayDurumuHelper.getBadgeClass(this.ders?.onayDurumu);
  }

  /**
   * Get OnayDurumu icon class
   */
  getOnayDurumuIcon(): string {
    return OnayDurumuHelper.getIcon(this.ders?.onayDurumu);
  }
}
