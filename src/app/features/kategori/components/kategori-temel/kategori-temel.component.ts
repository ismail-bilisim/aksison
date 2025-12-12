import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Kategori } from 'src/app/core/models/kategori';

@Component({
  selector: 'app-kategori-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kategori-temel.component.html',
  styleUrls: ['./kategori-temel.component.css']
})
export class KategoriTemelComponent {
  @Input() kategori?: Kategori;
  
  private router = inject(Router);

  navigateToKategori(kategoriId?: number): void {
    if (kategoriId) {
      this.router.navigate(['/kategori/detail', kategoriId]);
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
