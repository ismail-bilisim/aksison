import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDers } from 'src/app/core/models/videoders';
import { VideodersListComponent } from '../../components/videoders-list/videoders-list.component';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-videoders-by-proje-yoneticisi-page',
  standalone: true,
  imports: [CommonModule, VideodersListComponent, RouterLink],
  templateUrl: './videoders-by-proje-yoneticisi-page.component.html',
  styleUrl: './videoders-by-proje-yoneticisi-page.component.css'
})
export class VideodersByProjeYoneticisiPageComponent implements OnInit {
  videodersler: VideoDers[] = [];
  loading = false;
  error?: string;
  projeYoneticisiId?: number;

  constructor(
    private route: ActivatedRoute,
    private videodersService: VideodersService,
    private router: Router,
    private authService: AuthService
  ) {
    console.log('VideodersByProjeYoneticisiPageComponent - Constructor çalıştı');
  }

  ngOnInit() {
    console.log('VideodersByProjeYoneticisiPageComponent - ngOnInit çalıştı');
    // Login olmuş kullanıcının ID'sini al
    const userId = this.authService.getUserId();
    console.log('Proje Yöneticisi - Kullanıcı ID:', userId);
    
    if (userId) {
      this.projeYoneticisiId = userId;
      this.loadVideoDersler();
    } else {
      console.error('Kullanıcı ID alınamadı. Token bilgisi:', this.authService.getUserInfo());
      this.error = 'Kullanıcı bilgisi alınamadı. Lütfen tekrar giriş yapın.';
    }
  }

  loadVideoDersler() {
    if (!this.projeYoneticisiId) return;
    
    console.log('API çağrısı yapılıyor - Proje Yöneticisi ID:', this.projeYoneticisiId);
    this.loading = true;
    this.error = undefined;
    
    this.videodersService.getByProjeYoneticisi(this.projeYoneticisiId).subscribe({
      next: (res) => {
        console.log('Video dersler yüklendi:', res);
        this.videodersler = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('API Hatası:', err);
        this.error = err?.error?.message || err?.message || 'Video dersler yüklenirken hata oluştu.';
        this.loading = false;
      }
    });
  }

  onEdit(videoDers: VideoDers) {
    this.router.navigate(['/videoders/edit', videoDers.kodu]);
  }

  onDelete(kodu: number) {
    if (confirm('Bu video dersi silmek istediğinizden emin misiniz?')) {
      this.videodersService.delete(kodu).subscribe({
        next: () => this.loadVideoDersler(),
        error: (err) => {
          this.error = err?.error?.message || err?.message || 'Video ders silinirken hata oluştu.';
        }
      });
    }
  }
}
