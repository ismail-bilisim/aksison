import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-kategori-egitmen-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kategori-egitmen-list.component.html',
  styleUrls: ['./kategori-egitmen-list.component.css']
})
export class KategoriEgitmenListComponent implements OnInit {
  @Input() kategoriId!: number;

  private egitmenService = inject(EgitmenService);
  private toastService = inject(ToastService);

  egitmenler: EgitmenOzet[] = [];
  loading = false;

  ngOnInit(): void {
    if (this.kategoriId) {
      this.loadEgitmenler();
    }
  }

  loadEgitmenler(): void {
    this.loading = true;
    this.egitmenService.getByKategoriler([this.kategoriId]).subscribe({
      next: (data) => {
        this.egitmenler = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Eğitmenler yüklenirken hata:', error);
        this.toastService.error('Eğitmenler yüklenirken bir hata oluştu.');
        this.loading = false;
      }
    });
  }
}
