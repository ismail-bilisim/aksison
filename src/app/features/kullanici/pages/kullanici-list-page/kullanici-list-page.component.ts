import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';
import { Kullanici } from 'src/app/core/models/kullanici';
import { Router } from '@angular/router';
import { KullaniciListComponent } from '../../components/kullanici-list/kullanici-list.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { ErrorHandler } from 'src/app/core/utils/error-handler';

@Component({
  selector: 'app-kullanici-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, KullaniciListComponent],
  templateUrl: './kullanici-list-page.component.html',
  styleUrl: './kullanici-list-page.component.css'
})
export class KullaniciListPageComponent implements OnInit {
  kullanicilar: Kullanici[] = [];
  loading = false;
  error?: string;
  
  private toastService = inject(ToastService);

  constructor(private kullaniciService: KullaniciService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.loading = true;
    this.error = undefined;
    this.kullaniciService.getAll().subscribe({
      next: (data) => {
        this.kullanicilar = data || [];
        this.loading = false;
      },
      error: (err) => {
        const errorMsg = ErrorHandler.extractErrorMessage(err);
        this.error = errorMsg;
        this.toastService.error(errorMsg);
        this.loading = false;
      }
    });
  }

  onEdit(kullanici: Kullanici) {
    this.router.navigate(['/kullanici', kullanici.id, 'duzenle']);
  }

  onDelete(id: number) {
    if (confirm('Bu kullanıcı silinsin mi?')) {
      // Note: According to the API, delete requires tcKimlikNo, not id
      // You may need to adjust this based on your needs
      const kullanici = this.kullanicilar.find(k => k.id === id);
      if (kullanici && kullanici.tcKimlikNo) {
        this.kullaniciService.delete(kullanici.tcKimlikNo.toString()).subscribe({
          next: () => {
            this.toastService.success('Kullanıcı başarıyla silindi.');
            this.load();
          },
          error: (err) => {
            ErrorHandler.logError(err, 'deleteKullanici');
            this.toastService.error(ErrorHandler.extractErrorMessage(err));
          }
        });
      }
    }
  }
}

