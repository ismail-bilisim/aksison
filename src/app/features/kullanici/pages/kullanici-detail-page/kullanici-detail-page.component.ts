import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';
import { Kullanici } from 'src/app/core/models/kullanici';
import { KullaniciDetailComponent } from '../../components/kullanici-detail/kullanici-detail.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { ErrorHandler } from 'src/app/core/utils/error-handler';

@Component({
  selector: 'app-kullanici-detail-page',
  standalone: true,
  imports: [CommonModule, KullaniciDetailComponent],
  templateUrl: './kullanici-detail-page.component.html',
  styleUrl: './kullanici-detail-page.component.css'
})
export class KullaniciDetailPageComponent implements OnInit {
  kullanici?: Kullanici;
  loading = false;
  error?: string;
  
  private toastService = inject(ToastService);

  constructor(
    private route: ActivatedRoute,
    private kullaniciService: KullaniciService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadKullanici(+id);
    } else {
      this.error = 'Kullanıcı ID bulunamadı';
    }
  }

  private loadKullanici(id: number) {
    this.loading = true;
    this.error = undefined;
    this.kullaniciService.getById(id).subscribe({
      next: (data) => {
        this.kullanici = data;
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

  onEdit() {
    if (this.kullanici?.id) {
      this.router.navigate(['/kullanici', this.kullanici.id, 'duzenle']);
    }
  }

  onDelete() {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      if (this.kullanici?.tcKimlikNo) {
        this.kullaniciService.delete(this.kullanici.tcKimlikNo.toString()).subscribe({
          next: () => {
            this.toastService.success('Kullanıcı başarıyla silindi.');
            this.router.navigate(['/kullanici']);
          },
          error: (err) => {
            ErrorHandler.logError(err, 'deleteKullanici');
            this.toastService.error(ErrorHandler.extractErrorMessage(err));
          }
        });
      }
    }
  }

  onBack() {
    this.router.navigate(['/kullanici']);
  }
}
