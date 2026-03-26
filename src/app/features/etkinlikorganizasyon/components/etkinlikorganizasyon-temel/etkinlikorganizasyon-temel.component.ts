import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtkinlikOrganizasyonResponse } from '../../../../core/models/etkinlik-organizasyon-response';

@Component({
  selector: 'app-etkinlikorganizasyon-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etkinlikorganizasyon-temel.component.html',
  styleUrls: ['./etkinlikorganizasyon-temel.component.css']
})
export class EtkinlikOrganizasyonTemelComponent {
  @Input({ required: true }) etkinlik!: EtkinlikOrganizasyonResponse;

  formatTarih(tarih: string | null): string {
    if (!tarih) return '-';
    try {
      return new Date(tarih).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return tarih;
    }
  }
}
