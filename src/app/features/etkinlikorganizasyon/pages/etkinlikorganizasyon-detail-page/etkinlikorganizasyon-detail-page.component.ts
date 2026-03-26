import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { EtkinlikDurumu, ETKINLIK_DURUM_LABELS, ETKINLIK_DURUM_BADGE_CLASS } from '../../../../core/models/etkinlik-durumu.enum';
import { EtkinlikOrganizasyonResponse } from '../../../../core/models/etkinlik-organizasyon-response';
import { EtkinlikSurecTuruOzet } from '../../../../core/models/etkinlik-surec-turu-ozet';
import { EtkinlikGorevOzet } from '../../../../core/models/etkinlik-gorev-ozet';
import { KullaniciOzet } from '../../../../core/models/kullanici-ozet';

import { EtkinlikOrganizasyonService } from '../../../../core/services/api/etkinlik-organizasyon.service';
import { LookupService } from '../../../../core/services/api/lookup.service';
import { KullaniciService } from '../../../../core/services/api/kullanici.service';
import { ToastService } from '../../../../core/services/api/toast.service';

import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';

import { EtkinlikOrganizasyonTemelComponent } from '../../components/etkinlikorganizasyon-temel/etkinlikorganizasyon-temel.component';
import { EtkinlikOrganizasyonSureclerComponent } from '../../components/etkinlikorganizasyon-surecler/etkinlikorganizasyon-surecler.component';
import { EtkinlikOrganizasyonMateryallerComponent } from '../../components/etkinlikorganizasyon-materyaller/etkinlikorganizasyon-materyaller.component';
import { EtkinlikOrganizasyonIslemKayitlariComponent } from '../../components/etkinlikorganizasyon-islemkayitlari/etkinlikorganizasyon-islemkayitlari.component';
import { EtkinlikOrganizasyonBasvurularComponent } from '../../components/etkinlikorganizasyon-basvurular/etkinlikorganizasyon-basvurular.component';

@Component({
  selector: 'app-etkinlikorganizasyon-detail-page',
  standalone: true,
  imports: [
    CommonModule, DialogModule, NgbNavModule, RouterLink,
    EtkinlikOrganizasyonTemelComponent,
    EtkinlikOrganizasyonSureclerComponent,
    EtkinlikOrganizasyonMateryallerComponent,
    EtkinlikOrganizasyonIslemKayitlariComponent,
    EtkinlikOrganizasyonBasvurularComponent
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

  // Lookup data for child components
  surecTurleri = signal<EtkinlikSurecTuruOzet[]>([]);
  gorevTurleri = signal<EtkinlikGorevOzet[]>([]);
  etkinlikGorevlileri = signal<KullaniciOzet[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(Dialog);
  private readonly etkinlikService = inject(EtkinlikOrganizasyonService);
  private readonly lookupService = inject(LookupService);
  private readonly kullaniciService = inject(KullaniciService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadEtkinlik(+id);
      this.loadLookups();
      this.loadEtkinlikGorevlileri();
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
          this.gorevTurleri.set(data.gorevler);
        },
        error: (error) => console.error('Lookup yüklenemedi:', error)
      });
  }

  private loadEtkinlikGorevlileri(): void {
    this.kullaniciService.getByRolKodlari(['ETGRV'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.etkinlikGorevlileri.set(data),
        error: (error) => console.error('Etkinlik görevlileri yüklenemedi:', error)
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
}
