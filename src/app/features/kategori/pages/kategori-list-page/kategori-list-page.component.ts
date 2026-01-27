import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { KategoriListComponent } from '../../components/kategori-list/kategori-list.component';

@Component({
  selector: 'app-kategori-list-page',
  standalone: true,
  imports: [CommonModule, KategoriListComponent],
  templateUrl: './kategori-list-page.component.html',
  styleUrl: './kategori-list-page.component.css'
})
export class KategoriListPageComponent implements OnInit {
  private kategoriService = inject(KategoriService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  kategoriler: KategoriOzet[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadKategoriler();
  }

  loadKategoriler(): void {
    this.loading = true;
    this.kategoriService.getAllOzet().subscribe({
      next: (data) => {
        this.kategoriler = data;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.error('Kategoriler yüklenirken hata oluştu.');
        this.loading = false;
      }
    });
  }

  onRefresh(): void {
    this.loadKategoriler();
  }

  onKategoriClick(id?: number): void {
    if (id) {
      this.router.navigate(['/kategori/detail', id]);
    }
  }
}