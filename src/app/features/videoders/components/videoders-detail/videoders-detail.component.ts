import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDers } from 'src/app/core/models/videoders';

@Component({
  selector: 'app-videoders-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-detail.component.html',
})
export class VideodersDetailComponent implements OnInit {
  videoders?: VideoDers;
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private service: VideodersService
  ) { }

  ngOnInit(): void {
    const kodu = Number(this.route.snapshot.paramMap.get('kodu'));

    if (!kodu) {
      this.error = 'Geçersiz video ders kodu.';
      this.loading = false;
      return;
    }

    this.service.getByKodu(kodu).subscribe({
      next: (data) => {
        // API'nin VideoDersResponseDTO yapısı çok kapsamlı; 
        // Gelen yanıtı doğrudan modelimize atıyoruz.
        this.videoders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Video ders detayı alınamadı', err);
        this.error = 'Video ders detayı alınamadı.';
        this.loading = false;
      },
    });
  }

  /**
   * Nested DTO’lar boş olabilir, bu yüzden güvenli erişim kullanan küçük yardımcılar eklenebilir.
   */
  get turuLabel(): string {
    return this.videoders?.turu ? `${this.videoders.turu.adi} (${this.videoders.turu.kodu})` : '-';
  }

  get seviyesiLabel(): string {
    return this.videoders?.seviyesi ? `${this.videoders.seviyesi.adi} (${this.videoders.seviyesi.kodu})` : '-';
  }

  get niteligiLabel(): string {
    return this.videoders?.niteligi ? `${this.videoders.niteligi.adi} (${this.videoders.niteligi.kodu})` : '-';
  }

  get durumLabel(): string {
    return this.videoders?.dersDurumu ? `${this.videoders.dersDurumu.adi} (${this.videoders.dersDurumu.kodu})` : '-';
  }
}
