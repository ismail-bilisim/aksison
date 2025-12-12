import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DersResponse } from 'src/app/core/models/ders-response';
import { getOnayDurumuAciklama, getOnayDurumuBadgeClass, getOnayDurumuIcon } from 'src/app/core/utils/onay-durumu.util';

@Component({
  selector: 'app-ders-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-temel.component.html',
  styleUrls: ['./ders-temel.component.css']
})
export class DersTemelComponent {
  @Input() ders?: DersResponse;

  /**
   * Get OnayDurumu description for display
   */
  getOnayDurumuText(): string {
    return getOnayDurumuAciklama(this.ders?.onayDurumu ??''); // onayDurumu null ise default boş string
  }

  /**
   * Get OnayDurumu badge CSS class
   */
  getOnayDurumuBadge(): string {
    return getOnayDurumuBadgeClass(this.ders?.onayDurumu ?? ''); // onayDurumu null ise default boş string
  }

  /**
   * Get OnayDurumu icon class
   */
  getOnayDurumuIcon(): string {
    return getOnayDurumuIcon(this.ders?.onayDurumu ?? ''); // onayDurumu null ise default boş string
  }
}
