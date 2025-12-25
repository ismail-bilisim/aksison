import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoruResponse } from 'src/app/core/models/soru-response';

@Component({
  selector: 'app-soru-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './soru-temel.component.html',
  styleUrl: './soru-temel.component.css'
})
export class SoruTemelComponent {
  @Input() soru?: SoruResponse;

  getSoruTipiLabel(kod: string): string {
    const tipler: {[key: string]: string} = {
      'COKTAN_SECMELI': 'Çoktan Seçmeli',
      'DOGRU_YANLIS': 'Doğru-Yanlış'
    };
    return tipler[kod] || kod;
  }

  getZorlukDerecesiLabel(kod: string): string {
    const dereceler: {[key: string]: string} = {
      'KOLAY': 'Kolay',
      'ORTA': 'Orta',
      'ZOR': 'Zor'
    };
    return dereceler[kod] || kod;
  }

  getZorlukBadgeClass(kod: string): string {
    const classes: {[key: string]: string} = {
      'KOLAY': 'bg-success',
      'ORTA': 'bg-warning',
      'ZOR': 'bg-danger'
    };
    return classes[kod] || 'bg-secondary';
  }
}
