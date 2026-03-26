import { Component, Input, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EtkinlikOrganizasyonBasvuruResponse } from '../../../../core/models/etkinlik-organizasyon-basvuru-response';
import { EtkinlikOrganizasyonBasvuruService } from '../../../../core/services/api/etkinlik-organizasyon-basvuru.service';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-etkinlikorganizasyon-basvurular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etkinlikorganizasyon-basvurular.component.html'
})
export class EtkinlikOrganizasyonBasvurularComponent implements OnInit {
  @Input({ required: true }) etkinlikId!: number;

  basvurular = signal<EtkinlikOrganizasyonBasvuruResponse[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly basvuruService = inject(EtkinlikOrganizasyonBasvuruService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadBasvurular();
  }

  loadBasvurular(): void {
    this.basvuruService.getAllByEtkinlikOrganizasyonId(this.etkinlikId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.basvurular.set(data),
        error: (error) => {
          console.error('Başvurular yüklenemedi:', error);
          this.toastService.error('Başvurular yüklenirken hata oluştu.');
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
