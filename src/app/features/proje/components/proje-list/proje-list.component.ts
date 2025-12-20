import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjeOzet } from '../../../../core/models/proje-ozet';

@Component({
  selector: 'app-proje-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proje-list.component.html',
  styleUrl: './proje-list.component.css'
})
export class ProjeListComponent {
  @Input() projeler: ProjeOzet[] = [];
  
  private readonly router = inject(Router);

  onProjeClick(id: number): void {
    this.router.navigate(['/proje', id]);
  }

  getOnayDurumuBadgeClass(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'bg-warning';
      case 'ons': return 'bg-info';
      case 'red': return 'bg-danger';
      case 'ony': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getOnayDurumuText(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'Taslak';
      case 'ons': return 'Onay Bekliyor';
      case 'red': return 'Reddedildi';
      case 'ony': return 'Onaylandı';
      default: return onayDurumu;
    }
  }
}
