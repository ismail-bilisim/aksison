import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';
import { Kullanici } from 'src/app/core/models/kullanici';
import { Router } from '@angular/router';
import { KullaniciListComponent } from '../../components/kullanici-list/kullanici-list.component';

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
        this.error = err?.message || 'Kullanıcılar yüklenirken hata oluştu.';
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
          next: () => this.load(),
          error: (err) => alert('Silme işlemi başarısız: ' + (err?.message || 'Bilinmeyen hata'))
        });
      }
    }
  }
}

