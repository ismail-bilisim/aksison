import { Component, Input, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EtkinlikOrganizasyonSurecResponse } from '../../../../core/models/etkinlik-organizasyon-surec-response';
import { EtkinlikOrganizasyonSurecGorevResponse } from '../../../../core/models/etkinlik-organizasyon-surec-gorev-response';
import { EtkinlikSurecTuruOzet } from '../../../../core/models/etkinlik-surec-turu-ozet';
import { EtkinlikGorevOzet } from '../../../../core/models/etkinlik-gorev-ozet';
import { KullaniciOzet } from '../../../../core/models/kullanici-ozet';
import { GorevDurumu, GOREV_DURUM_LABELS, GOREV_DURUM_BADGE_CLASS } from '../../../../core/models/gorev-durumu.enum';

import { EtkinlikOrganizasyonSurecService } from '../../../../core/services/api/etkinlik-organizasyon-surec.service';
import { EtkinlikOrganizasyonSurecGorevService } from '../../../../core/services/api/etkinlik-organizasyon-surec-gorev.service';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-etkinlikorganizasyon-surecler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etkinlikorganizasyon-surecler.component.html'
})
export class EtkinlikOrganizasyonSureclerComponent implements OnInit {
  @Input({ required: true }) etkinlikId!: number;
  @Input() surecTurleri: EtkinlikSurecTuruOzet[] = [];
  @Input() gorevTurleri: EtkinlikGorevOzet[] = [];
  @Input() etkinlikGorevlileri: KullaniciOzet[] = [];

  readonly GorevDurumu = GorevDurumu;

  surecler = signal<EtkinlikOrganizasyonSurecResponse[]>([]);
  gorevlerMap = signal<Map<number, EtkinlikOrganizasyonSurecGorevResponse[]>>(new Map());

  // Süreç ekleme form
  yeniSurecTuruKodu = '';
  yeniSurecAciklama = '';

  // Görev ekleme form
  gorevEklemeSurecId?: number;
  yeniGorevKodu = '';
  yeniGorevAciklama = '';
  yeniGorevliId?: number;

  private readonly destroyRef = inject(DestroyRef);
  private readonly surecService = inject(EtkinlikOrganizasyonSurecService);
  private readonly gorevService = inject(EtkinlikOrganizasyonSurecGorevService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadSurecler();
  }

  // ==================== Süreçler ====================

  loadSurecler(): void {
    this.surecService.getByEtkinlikOrganizasyonId(this.etkinlikId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.surecler.set(data);
          data.forEach(s => this.loadGorevlerBySurec(s.id));
        },
        error: (error) => {
          console.error('Süreçler yüklenemedi:', error);
          this.toastService.error('Süreçler yüklenirken hata oluştu.');
        }
      });
  }

  loadGorevlerBySurec(surecId: number): void {
    this.gorevService.getBySurecId(surecId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const current = new Map(this.gorevlerMap());
          current.set(surecId, data);
          this.gorevlerMap.set(current);
        },
        error: (error) => console.error('Görevler yüklenemedi:', error)
      });
  }

  onSurecEkle(): void {
    if (!this.yeniSurecTuruKodu) return;
    this.surecService.create({
      etkinlikOrganizasyonId: this.etkinlikId,
      surecTuruKodu: this.yeniSurecTuruKodu,
      aciklama: this.yeniSurecAciklama || undefined
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Süreç eklendi.');
          this.yeniSurecTuruKodu = '';
          this.yeniSurecAciklama = '';
          this.loadSurecler();
        },
        error: (error) => {
          console.error('Süreç eklenemedi:', error);
          this.toastService.error('Süreç eklenirken hata oluştu.');
        }
      });
  }

  onSurecSil(surecId: number): void {
    if (!confirm('Bu süreci silmek istediğinize emin misiniz?')) return;
    this.surecService.delete(surecId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Süreç silindi.');
          this.loadSurecler();
        },
        error: (error) => {
          console.error('Süreç silinemedi:', error);
          this.toastService.error('Süreç silinirken hata oluştu.');
        }
      });
  }

  // ==================== Görevler ====================

  onGorevEkle(surecId: number): void {
    if (!this.yeniGorevKodu) return;
    this.gorevService.create({
      surecId,
      gorevKodu: this.yeniGorevKodu,
      gorevliId: this.yeniGorevliId,
      aciklama: this.yeniGorevAciklama || undefined
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Görev eklendi.');
          this.yeniGorevKodu = '';
          this.yeniGorevAciklama = '';
          this.yeniGorevliId = undefined;
          this.gorevEklemeSurecId = undefined;
          this.loadGorevlerBySurec(surecId);
        },
        error: (error) => {
          console.error('Görev eklenemedi:', error);
          this.toastService.error('Görev eklenirken hata oluştu.');
        }
      });
  }

  onGorevliAta(gorevId: number, gorevliId: number, surecId: number): void {
    this.gorevService.gorevliAta(gorevId, gorevliId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Görevli atandı.');
          this.loadGorevlerBySurec(surecId);
        },
        error: (error) => {
          console.error('Görevli atanamadı:', error);
          this.toastService.error('Görevli atanırken hata oluştu.');
        }
      });
  }

  onGorevDurumuGuncelle(gorevId: number, yeniDurum: string, surecId: number): void {
    this.gorevService.gorevDurumuGuncelle(gorevId, yeniDurum)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Görev durumu güncellendi.');
          this.loadGorevlerBySurec(surecId);
        },
        error: (error) => {
          console.error('Görev durumu güncellenemedi:', error);
          this.toastService.error('Görev durumu güncellenirken hata oluştu.');
        }
      });
  }

  // ==================== Helpers ====================

  getGorevDurumuLabel(durum: string | null): string {
    return GOREV_DURUM_LABELS[durum ?? ''] || 'Bilinmiyor';
  }

  getGorevDurumuBadge(durum: string | null): string {
    return GOREV_DURUM_BADGE_CLASS[durum ?? ''] || 'bg-secondary';
  }
}
