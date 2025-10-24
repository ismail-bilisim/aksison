import { Component, OnInit } from '@angular/core';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';
import { Kullanici } from 'src/app/core/models/kullanici';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kullanici-list-page',
  imports: [],
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
      next: (data) => (this.kullanicilar = data || []),
      error: (err) => (this.error = err?.message || 'Kullanıcılar yüklenirken hata oluştu.'),
      complete: () => (this.loading = false),
    });
  }

  onEdit(kullanici: Kullanici) {
    this.router.navigate(['/kullanicilar/edit', kullanici.id]);
  }

  onDelete(id: number) {
    if (confirm('Bu kullanıcı silinsin mi?')) {
      this.kullaniciService.delete(id).subscribe(() => this.load());
    }
  }
}

