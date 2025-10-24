import { Component, Input } from '@angular/core';
import { Kullanici } from 'src/app/core/models/kullanici';

@Component({
  selector: 'app-kullanici-detail',
  imports: [],
  templateUrl: './kullanici-detail.component.html',
  styleUrl: './kullanici-detail.component.css',
})
export class KullaniciDetailComponent {
  @Input() kullanici?: Kullanici;

  get fullName(): string {
    if (!this.kullanici) return '';
    return `${this.kullanici.ad ?? ''} ${this.kullanici.soyad ?? ''}`.trim();
  }

  get statusLabel(): string {
    if (this.kullanici?.aktifMi === undefined || this.kullanici?.aktifMi === null) {
      return 'Bilinmiyor';
    }
    return this.kullanici.aktifMi ? 'Aktif' : 'Pasif';
  }
}

