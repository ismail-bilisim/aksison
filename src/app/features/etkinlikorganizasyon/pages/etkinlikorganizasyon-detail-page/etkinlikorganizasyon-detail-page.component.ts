import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { EtkinlikDurumu, ETKINLIK_DURUM_LABELS, ETKINLIK_DURUM_BADGE_CLASS } from '../../../../core/models/etkinlik-durumu.enum';
import { EtkinlikOrganizasyonResponse } from '../../../../core/models/etkinlik-organizasyon-response';
import { EtkinlikOrganizasyonSurecResponse } from '../../../../core/models/etkinlik-organizasyon-surec-response';
import { EtkinlikOrganizasyonSurecGorevResponse } from '../../../../core/models/etkinlik-organizasyon-surec-gorev-response';
import { EtkinlikOrganizasyonIslemKayitResponse } from '../../../../core/models/etkinlik-organizasyon-islem-kayit-response';
import { EtkinlikOrganizasyonBasvuruResponse } from '../../../../core/models/etkinlik-organizasyon-basvuru-response';
import { EtkinlikOrganizasyonMateryalResponse } from '../../../../core/models/etkinlik-organizasyon-materyal-response';
import { EtkinlikSurecTuruOzet } from '../../../../core/models/etkinlik-surec-turu-ozet';
import { EtkinlikGorevOzet } from '../../../../core/models/etkinlik-gorev-ozet';
import { MedyaTuruOzet } from '../../../../core/models/medya-turu-ozet';

import { EtkinlikOrganizasyonService } from '../../../../core/services/api/etkinlik-organizasyon.service';
import { EtkinlikOrganizasyonSurecService } from '../../../../core/services/api/etkinlik-organizasyon-surec.service';
import { EtkinlikOrganizasyonSurecGorevService } from '../../../../core/services/api/etkinlik-organizasyon-surec-gorev.service';
import { EtkinlikOrganizasyonIslemKayitService } from '../../../../core/services/api/etkinlik-organizasyon-islem-kayit.service';
import { EtkinlikOrganizasyonBasvuruService } from '../../../../core/services/api/etkinlik-organizasyon-basvuru.service';
import { EtkinlikOrganizasyonMateryalService } from '../../../../core/services/api/etkinlik-organizasyon-materyal.service';
import { LookupService } from '../../../../core/services/api/lookup.service';
import { ToastService } from '../../../../core/services/api/toast.service';

import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';

@Component({
  selector: 'app-etkinlikorganizasyon-detail-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DialogModule, NgbNavModule, RouterLink
  ],
  templateUrl: './etkinlikorganizasyon-detail-page.component.html',
  styleUrls: ['./etkinlikorganizasyon-detail-page.component.css']
})
export class EtkinlikOrganizasyonDetailPageComponent implements OnInit {
  etkinlik?: EtkinlikOrganizasyonResponse;
  loading = false;
  activeTab = 'surecler';
  submitting = false;
  readonly EtkinlikDurumu = EtkinlikDurumu;

  // Tab data signals
  surecler = signal<EtkinlikOrganizasyonSurecResponse[]>([]);
  gorevlerMap = signal<Map<number, EtkinlikOrganizasyonSurecGorevResponse[]>>(new Map());
  islemKayitlari = signal<EtkinlikOrganizasyonIslemKayitResponse[]>([]);
  basvurular = signal<EtkinlikOrganizasyonBasvuruResponse[]>([]);
  materyaller = signal<EtkinlikOrganizasyonMateryalResponse[]>([]);
  medyaTurleri = signal<MedyaTuruOzet[]>([]);

  // Lookup data
  surecTurleri = signal<EtkinlikSurecTuruOzet[]>([]);
  gorevler = signal<EtkinlikGorevOzet[]>([]);

  // Lazy loading flags
  sureclerLoaded = false;
  islemKayitlarLoaded = false;
  basvurularLoaded = false;
  materyallerLoaded = false;

  // Süreç ekleme form
  yeniSurecTuruKodu = '';
  yeniSurecAciklama = '';

  // Görev ekleme form
  gorevEklemeSurecId?: number;
  yeniGorevKodu = '';
  yeniGorevAciklama = '';

  // Materyal upload
  selectedFile?: File;
  selectedMedyaTuruId?: number;

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(Dialog);
  private readonly etkinlikService = inject(EtkinlikOrganizasyonService);
  private readonly surecService = inject(EtkinlikOrganizasyonSurecService);
  private readonly gorevService = inject(EtkinlikOrganizasyonSurecGorevService);
  private readonly islemKayitService = inject(EtkinlikOrganizasyonIslemKayitService);
  private readonly basvuruService = inject(EtkinlikOrganizasyonBasvuruService);
  private readonly materyalService = inject(EtkinlikOrganizasyonMateryalService);
  private readonly lookupService = inject(LookupService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadEtkinlik(+id);
      this.loadLookups();
    }
  }

  // ==================== Data Loading ====================

  private loadEtkinlik(id: number): void {
    this.loading = true;
    this.etkinlikService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.etkinlik = data;
          this.loading = false;
          // Auto-load first tab
          this.loadSurecler();
        },
        error: (error) => {
          console.error('Etkinlik yüklenemedi:', error);
          this.toastService.error('Etkinlik yüklenirken hata oluştu.');
          this.loading = false;
        }
      });
  }

  private loadLookups(): void {
    this.lookupService.getEtkinlikOrganizasyonLookups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.surecTurleri.set(data.surecTurleri);
          this.gorevler.set(data.gorevler);
        },
        error: (error) => console.error('Lookup yüklenemedi:', error)
      });
  }

  onTabChange(event: NgbNavChangeEvent): void {
    this.activeTab = event.nextId;
    switch (this.activeTab) {
      case 'surecler':
        if (!this.sureclerLoaded) this.loadSurecler();
        break;
      case 'materyaller':
        if (!this.materyallerLoaded) this.loadMateryaller();
        break;
      case 'islemkayitlari':
        if (!this.islemKayitlarLoaded) this.loadIslemKayitlari();
        break;
      case 'basvurular':
        if (!this.basvurularLoaded) this.loadBasvurular();
        break;
    }
  }

  // ==================== Süreçler ====================

  loadSurecler(): void {
    if (!this.etkinlik?.id) return;
    this.surecService.getByEtkinlikOrganizasyonId(this.etkinlik.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.surecler.set(data);
          this.sureclerLoaded = true;
          // Load gorevler for each surec
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
    if (!this.etkinlik?.id || !this.yeniSurecTuruKodu) return;
    this.surecService.create({
      etkinlikOrganizasyonId: this.etkinlik.id,
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
      aciklama: this.yeniGorevAciklama || undefined
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Görev eklendi.');
          this.yeniGorevKodu = '';
          this.yeniGorevAciklama = '';
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

  getGorevDurumuLabel(durum: string | null): string {
    const labels: Record<string, string> = {
      '0': 'Bekliyor',
      '1': 'Başladı',
      '2': 'Devam Ediyor',
      '3': 'Tamamlandı',
      '4': 'İptal'
    };
    return labels[durum ?? ''] || 'Bilinmiyor';
  }

  getGorevDurumuBadge(durum: string | null): string {
    const badges: Record<string, string> = {
      '0': 'bg-secondary',
      '1': 'bg-info',
      '2': 'bg-warning text-dark',
      '3': 'bg-success',
      '4': 'bg-dark'
    };
    return badges[durum ?? ''] || 'bg-secondary';
  }

  // ==================== Materyaller ====================

  loadMateryaller(): void {
    if (!this.etkinlik?.id) return;
    this.materyalService.getByEtkinlikOrganizasyonId(this.etkinlik.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.materyaller.set(data);
          this.materyallerLoaded = true;
        },
        error: (error) => {
          console.error('Materyaller yüklenemedi:', error);
          this.toastService.error('Materyaller yüklenirken hata oluştu.');
        }
      });
    // Also load medya turleri
    this.materyalService.getMedyaTurleri()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.medyaTurleri.set(data),
        error: (error) => console.error('Medya türleri yüklenemedi:', error)
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onMateryalUpload(): void {
    if (!this.etkinlik?.id || !this.selectedFile || !this.selectedMedyaTuruId) return;
    this.materyalService.upload(this.etkinlik.id, this.selectedMedyaTuruId, this.selectedFile)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Materyal yüklendi.');
          this.selectedFile = undefined;
          this.selectedMedyaTuruId = undefined;
          this.loadMateryaller();
        },
        error: (error) => {
          console.error('Materyal yüklenemedi:', error);
          this.toastService.error('Materyal yüklenirken hata oluştu.');
        }
      });
  }

  onMateryalSil(id: number): void {
    if (!confirm('Bu materyali silmek istediğinize emin misiniz?')) return;
    this.materyalService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Materyal silindi.');
          this.loadMateryaller();
        },
        error: (error) => {
          console.error('Materyal silinemedi:', error);
          this.toastService.error('Materyal silinirken hata oluştu.');
        }
      });
  }

  onMateryalIndir(id: number, dosyaAdi: string): void {
    this.materyalService.download(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const url = globalThis.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = dosyaAdi;
          a.click();
          globalThis.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Materyal indirilemedi:', error);
          this.toastService.error('Materyal indirilirken hata oluştu.');
        }
      });
  }

  // ==================== İşlem Kayıtları ====================

  loadIslemKayitlari(): void {
    if (!this.etkinlik?.id) return;
    this.islemKayitService.getByEtkinlikOrganizasyonId(this.etkinlik.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.islemKayitlari.set(data);
          this.islemKayitlarLoaded = true;
        },
        error: (error) => {
          console.error('İşlem kayıtları yüklenemedi:', error);
          this.toastService.error('İşlem kayıtları yüklenirken hata oluştu.');
        }
      });
  }

  // ==================== Başvurular ====================

  loadBasvurular(): void {
    if (!this.etkinlik?.id) return;
    this.basvuruService.getAllByEtkinlikOrganizasyonId(this.etkinlik.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.basvurular.set(data);
          this.basvurularLoaded = true;
        },
        error: (error) => {
          console.error('Başvurular yüklenemedi:', error);
          this.toastService.error('Başvurular yüklenirken hata oluştu.');
        }
      });
  }

  // ==================== Workflow ====================

  private workflowIslemYap(
    config: ApprovalDialogData,
    serviceFn: (id: number, aciklama?: string) => import('rxjs').Observable<EtkinlikOrganizasyonResponse>,
    successMessage: string
  ): void {
    if (!this.etkinlik?.id) return;
    const etkinlikId = this.etkinlik.id;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: config,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined && result !== null) {
          this.submitting = true;
          serviceFn(etkinlikId, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (updated) => {
                this.etkinlik = updated;
                this.submitting = false;
                this.toastService.success(successMessage);
              },
              error: (error) => {
                console.error('Workflow işlem hatası:', error);
                this.toastService.error('İşlem sırasında bir hata oluştu.');
                this.submitting = false;
              }
            });
        }
      });
  }

  onayaSun(): void {
    this.workflowIslemYap(
      { title: 'Onaya Sun', message: 'Etkinliği onaya sunmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Onaya Sun', appearance: 'approve' },
      (id, aciklama) => this.etkinlikService.onayaSun(id, aciklama),
      'Etkinlik onaya sunuldu.'
    );
  }

  onayla(): void {
    this.workflowIslemYap(
      { title: 'Onayla', message: 'Etkinliği onaylamak istediğinize emin misiniz?', noteLabel: 'Onay Notu (İsteğe Bağlı)', confirmText: 'Onayla', appearance: 'approve' },
      (id, aciklama) => this.etkinlikService.onayla(id, aciklama),
      'Etkinlik onaylandı.'
    );
  }

  reddet(): void {
    this.workflowIslemYap(
      { title: 'Reddet', message: 'Etkinliği reddetmek istediğinize emin misiniz?', noteLabel: 'Red Gerekçesi', confirmText: 'Reddet', appearance: 'reject' },
      (id, aciklama) => this.etkinlikService.reddet(id, aciklama),
      'Etkinlik reddedildi.'
    );
  }

  tamamla(): void {
    this.workflowIslemYap(
      { title: 'Tamamla', message: 'Etkinliği tamamlamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Tamamla', appearance: 'approve' },
      (id, aciklama) => this.etkinlikService.tamamla(id, aciklama),
      'Etkinlik tamamlandı.'
    );
  }

  iptalEt(): void {
    this.workflowIslemYap(
      { title: 'İptal Et', message: 'Etkinliği iptal etmek istediğinize emin misiniz?', noteLabel: 'İptal Gerekçesi', confirmText: 'İptal Et', appearance: 'reject' },
      (id, aciklama) => this.etkinlikService.iptalEt(id, aciklama),
      'Etkinlik iptal edildi.'
    );
  }

  // ==================== Helpers ====================

  getDurumLabel(durumKodu: string | undefined): string {
    if (!durumKodu) return '';
    return ETKINLIK_DURUM_LABELS[durumKodu] || durumKodu;
  }

  getDurumBadgeClass(durumKodu: string | undefined): string {
    if (!durumKodu) return 'bg-secondary';
    return ETKINLIK_DURUM_BADGE_CLASS[durumKodu] || 'bg-secondary';
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
