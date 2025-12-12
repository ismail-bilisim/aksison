import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DersService } from 'src/app/core/services/api/ders.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-kategori-ders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kategori-ders-list.component.html',
  styleUrls: ['./kategori-ders-list.component.css']
})
export class KategoriDersListComponent implements OnInit {
  @Input() kategoriId!: number;

  private dersService = inject(DersService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  dersler: DersOzet[] = [];
  loading = false;

  ngOnInit(): void {
    if (this.kategoriId) {
      this.loadDersler();
    }
  }

  loadDersler(): void {
    this.loading = true;
    this.dersService.getByKategoriler([this.kategoriId]).subscribe({
      next: (data) => {
        this.dersler = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Dersler yüklenirken hata:', error);
        this.toastService.error('Dersler yüklenirken bir hata oluştu.');
        this.loading = false;
      }
    });
  }

  navigateToDers(dersId?: number): void {
    if (dersId) {
      this.router.navigate(['/ders/detail', dersId]);
    }
  }
}
