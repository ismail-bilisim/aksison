import { Component, Input, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EtkinlikOrganizasyonIslemKayitResponse } from '../../../../core/models/etkinlik-organizasyon-islem-kayit-response';
import { EtkinlikOrganizasyonIslemKayitService } from '../../../../core/services/api/etkinlik-organizasyon-islem-kayit.service';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-etkinlikorganizasyon-islemkayitlari',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etkinlikorganizasyon-islemkayitlari.component.html'
})
export class EtkinlikOrganizasyonIslemKayitlariComponent implements OnInit {
  @Input({ required: true }) etkinlikId!: number;

  islemKayitlari = signal<EtkinlikOrganizasyonIslemKayitResponse[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly islemKayitService = inject(EtkinlikOrganizasyonIslemKayitService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadIslemKayitlari();
  }

  loadIslemKayitlari(): void {
    this.islemKayitService.getByEtkinlikOrganizasyonId(this.etkinlikId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.islemKayitlari.set(data),
        error: (error) => {
          console.error('İşlem kayıtları yüklenemedi:', error);
          this.toastService.error('İşlem kayıtları yüklenirken hata oluştu.');
        }
      });
  }

  formatTarih(tarih: string | null): string {
    if (!tarih) return '-';
    try {
      return new Date(tarih).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return tarih;
    }
  }
}
