import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SoruOzet } from 'src/app/core/models/soru-ozet';

@Component({
  selector: 'app-soru-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './soru-list.component.html',
  styleUrl: './soru-list.component.css'
})
export class SoruListComponent {
  @Input() sorular: SoruOzet[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  private readonly router = inject(Router);

  onRowClick(soruId: number): void {
    if (soruId) {
      this.router.navigate(['/soru/detail', soruId]);
    }
  }

  onEdit(event: Event, soruId: number): void {
    event.stopPropagation();
    this.edit.emit(soruId);
  }

  onDelete(event: Event, soruId: number): void {
    event.stopPropagation();
    this.delete.emit(soruId);
  }

  getSoruTipiLabel(kod: string): string {
    const tipler: {[key: string]: string} = {
      'COKSC': 'Çoktan Seçmeli',
      'DOGYN': 'Doğru-Yanlış'
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

  truncateText(text: string, maxLength: number = 100): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
