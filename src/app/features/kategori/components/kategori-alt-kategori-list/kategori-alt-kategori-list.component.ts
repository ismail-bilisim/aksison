import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { Kategori } from 'src/app/core/models/kategori';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-kategori-alt-kategori-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kategori-alt-kategori-list.component.html',
  styleUrls: ['./kategori-alt-kategori-list.component.css']
})
export class KategoriAltKategoriListComponent implements OnInit {
  @Input() kategoriId!: number;

  private kategoriService = inject(KategoriService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  altKategoriler: Kategori[] = [];
  loading = false;

  ngOnInit(): void {
    if (this.kategoriId) {
      this.loadAltKategoriler();
    }
  }

  loadAltKategoriler(): void {
    this.loading = true;
    this.kategoriService.getAltKategoriler(this.kategoriId).subscribe({
      next: (data) => {
        this.altKategoriler = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Alt kategoriler yüklenirken hata:', error);
        this.toastService.error('Alt kategoriler yüklenirken bir hata oluştu.');
        this.loading = false;
      }
    });
  }

  navigateToKategori(kategoriId?: number): void {
    if (kategoriId) {
      this.router.navigate(['/kategori/detail', kategoriId]);
    }
  }
}
