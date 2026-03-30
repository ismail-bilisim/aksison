import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgbNavModule, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ProsedurDurumu, PROSEDUR_DURUM_LABELS, PROSEDUR_DURUM_BADGE_CLASS } from '../../../../core/models/prosedur-durumu.enum';
import { ProsedurResponse } from '../../../../core/models/prosedur-response';
import { PrensipRequest } from '../../../../core/models/prensip-request';
import { StandartRequest } from '../../../../core/models/standart-request';
import { SurecAdimRequest } from '../../../../core/models/surec-adim-request';
import { IslemKayit } from '../../../../core/models/islem-kayit';
import { MaddeLogResponse } from '../../../../core/models/madde-log-response';

import { ProsedurService } from '../../../../core/services/api/prosedur.service';
import { PrensipService } from '../../../../core/services/api/prensip.service';
import { StandartService } from '../../../../core/services/api/standart.service';
import { SurecAdimService } from '../../../../core/services/api/surec-adim.service';
import { ProsedurIslemKayitService } from '../../../../core/services/api/prosedur-islem-kayit.service';
import { ToastService } from '../../../../core/services/api/toast.service';

import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';
import { ProsedurTemelComponent } from '../../components/prosedur-temel/prosedur-temel.component';
import { IslemKayitListComponent } from 'src/app/shared/components/islem-kayit-list/islem-kayit-list.component';
import { TarihceListComponent } from 'src/app/shared/components/tarihce-list/tarihce-list.component';
import { ProsedurPrensipDialogComponent } from '../../components/prosedur-prensip-dialog/prosedur-prensip-dialog.component';
import { ProsedurStandartDialogComponent } from '../../components/prosedur-standart-dialog/prosedur-standart-dialog.component';
import { ProsedurSurecAdimDialogComponent } from '../../components/prosedur-surec-adim-dialog/prosedur-surec-adim-dialog.component';

@Component({
  selector: 'app-prosedur-detail-page',
  standalone: true,
  imports: [
    CommonModule, DialogModule, NgbNavModule, RouterLink,
    ProsedurTemelComponent,
    IslemKayitListComponent,
    TarihceListComponent
  ],
  templateUrl: './prosedur-detail-page.component.html'
})
export class ProsedurDetailPageComponent implements OnInit {
  prosedur?: ProsedurResponse;
  loading = false;
  activeTab = 'islemkayitlari';
  submitting = false;
  readonly ProsedurDurumu = ProsedurDurumu;

  // İşlem Kayıtları — lazy loaded
  prosedurIslemKayitlar = signal<IslemKayit[]>([]);
  prosedurIslemKayitLoading = signal(false);
  private islemlerLoaded = false;

  // Prensip Tarihçe — lazy loaded
  prensipLogs = signal<MaddeLogResponse[]>([]);
  prensipLogsLoading = signal(false);
  private prensipLogsLoaded = false;

  // Standart Tarihçe — lazy loaded
  standartLogs = signal<MaddeLogResponse[]>([]);
  standartLogsLoading = signal(false);
  private standartLogsLoaded = false;

  // Süreç Adımları Tarihçe — lazy loaded
  surecAdimLogs = signal<MaddeLogResponse[]>([]);
  surecAdimLogsLoading = signal(false);
  private surecAdimLogsLoaded = false;

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(Dialog);
  private readonly prosedurService = inject(ProsedurService);
  private readonly prensipService = inject(PrensipService);
  private readonly standartService = inject(StandartService);
  private readonly surecAdimService = inject(SurecAdimService);
  private readonly islemKayitService = inject(ProsedurIslemKayitService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadProsedur(+id);
    }
  }

  // ==================== Data Loading ====================

  private loadProsedur(id: number): void {
    this.loading = true;
    this.prosedurService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.prosedur = data;
          this.loading = false;
//Sorunun kaynağı: activeTab zaten 'islemkayitlari' olarak başlatıldığı için onTabChange event'i hiç tetiklenmiyordu ve loadIslemKayitlari() asla çağrılmıyordu.

// Şimdi prosedür verisi yüklendikten hemen sonra, varsayılan sekme islemkayitlari ise işlem kayıtları otomatik olarak yükleniyor.
          // Varsayılan sekme islemkayitlari ise hemen yükle
          if (this.activeTab === 'islemkayitlari' && !this.islemlerLoaded) {
            this.loadIslemKayitlari();
          }
        },
        error: (error) => {
          console.error('Prosedür yüklenemedi:', error);
          this.toastService.error('Prosedür yüklenirken hata oluştu.');
          this.loading = false;
        }
      });
  }

  private reloadProsedur(): void {
    if (this.prosedur?.id) {
      this.loadProsedur(this.prosedur.id);
    }
  }

  private loadIslemKayitlari(): void {
    if (!this.prosedur?.id) return;
    this.prosedurIslemKayitLoading.set(true);
    this.islemKayitService.getByProsedurId(this.prosedur.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.prosedurIslemKayitlar.set(data as IslemKayit[]);
          this.prosedurIslemKayitLoading.set(false);
          this.islemlerLoaded = true;
        },
        error: (error) => {
          console.error('İşlem kayıtları yüklenemedi:', error);
          this.prosedurIslemKayitLoading.set(false);
        }
      });
  }

  // ==================== Tab Change ====================

  onTabChange(event: NgbNavChangeEvent): void {
    if (event.nextId === 'islemkayitlari' && !this.islemlerLoaded) {
      this.loadIslemKayitlari();
    }
    if (event.nextId === 'prensip-tarihce' && !this.prensipLogsLoaded) {
      this.loadPrensipLogs();
    }
    if (event.nextId === 'standart-tarihce' && !this.standartLogsLoaded) {
      this.loadStandartLogs();
    }
    if (event.nextId === 'surec-adim-tarihce' && !this.surecAdimLogsLoaded) {
      this.loadSurecAdimLogs();
    }
  }

  private loadPrensipLogs(): void {
    if (!this.prosedur?.id) return;
    this.prensipLogsLoading.set(true);
    this.prensipService.getLogsByProsedurId(this.prosedur.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.prensipLogs.set(data);
          this.prensipLogsLoading.set(false);
          this.prensipLogsLoaded = true;
        },
        error: (error) => {
          console.error('Prensip tarihçesi yüklenemedi:', error);
          this.prensipLogsLoading.set(false);
        }
      });
  }

  private loadStandartLogs(): void {
    if (!this.prosedur?.id) return;
    this.standartLogsLoading.set(true);
    this.standartService.getLogsByProsedurId(this.prosedur.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.standartLogs.set(data);
          this.standartLogsLoading.set(false);
          this.standartLogsLoaded = true;
        },
        error: (error) => {
          console.error('Standart tarihçesi yüklenemedi:', error);
          this.standartLogsLoading.set(false);
        }
      });
  }

  private loadSurecAdimLogs(): void {
    if (!this.prosedur?.id) return;
    this.surecAdimLogsLoading.set(true);
    this.surecAdimService.getLogsByProsedurId(this.prosedur.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.surecAdimLogs.set(data);
          this.surecAdimLogsLoading.set(false);
          this.surecAdimLogsLoaded = true;
        },
        error: (error) => {
          console.error('Süreç adımları tarihçesi yüklenemedi:', error);
          this.surecAdimLogsLoading.set(false);
        }
      });
  }


  // ==================== Workflow ====================

  private workflowIslemYap(
    config: ApprovalDialogData,
    serviceFn: (id: number, aciklama?: string) => import('rxjs').Observable<ProsedurResponse>,
    successMessage: string
  ): void {
    if (!this.prosedur?.id) return;
    const prosedurId = this.prosedur.id;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: config,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined && result !== null) {
          this.submitting = true;
          serviceFn(prosedurId, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (updated) => {
                this.prosedur = updated;
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
      { title: 'Onaya Sun', message: 'Prosedürü onaya sunmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Onaya Sun', appearance: 'approve' },
      (id, aciklama) => this.prosedurService.onayaSun(id, aciklama),
      'Prosedür onaya sunuldu.'
    );
  }

  onayla(): void {
    this.workflowIslemYap(
      { title: 'Onayla', message: 'Prosedürü onaylamak istediğinize emin misiniz?', noteLabel: 'Onay Notu (İsteğe Bağlı)', confirmText: 'Onayla', appearance: 'approve' },
      (id, aciklama) => this.prosedurService.onayla(id, aciklama),
      'Prosedür onaylandı.'
    );
  }

  reddet(): void {
    this.workflowIslemYap(
      { title: 'Reddet', message: 'Prosedürü reddetmek istediğinize emin misiniz?', noteLabel: 'Red Gerekçesi', confirmText: 'Reddet', appearance: 'reject' },
      (id, aciklama) => this.prosedurService.reddet(id, aciklama),
      'Prosedür reddedildi.'
    );
  }

  mulgaYap(): void {
    this.workflowIslemYap(
      { title: 'Mülga Yap', message: 'Prosedürü mülga yapmak istediğinize emin misiniz? Bu işlem geri alınamaz.', noteLabel: 'Mülga Gerekçesi', confirmText: 'Mülga Yap', appearance: 'reject' },
      (id, aciklama) => this.prosedurService.mulgaYap(id, aciklama),
      'Prosedür mülga yapıldı.'
    );
  }

  iptalEt(): void {
    this.workflowIslemYap(
      { title: 'İptal Et', message: 'Prosedürü iptal etmek istediğinize emin misiniz?', noteLabel: 'İptal Gerekçesi', confirmText: 'İptal Et', appearance: 'reject' },
      (id, aciklama) => this.prosedurService.iptalEt(id, aciklama),
      'Prosedür iptal edildi.'
    );
  }

  // ==================== Prensip / Standart Inline Edit ====================

  onPrensipUpdate(event: { id: number; request: PrensipRequest }): void {
    this.prensipService.update(event.id, event.request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Prensip güncellendi.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Prensip güncellenirken hata oluştu:', error);
          this.toastService.error('Prensip güncellenirken hata oluştu.');
        }
      });
  }

  onStandartUpdate(event: { id: number; request: StandartRequest }): void {
    this.standartService.update(event.id, event.request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Standart güncellendi.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Standart güncellenirken hata oluştu:', error);
          this.toastService.error('Standart güncellenirken hata oluştu.');
        }
      });
  }

  onPrensipDelete(id: number): void {
    if (!confirm('Prensibi silmek istediğinize emin misiniz?')) return;
    this.prensipService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Prensip silindi.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Prensip silinirken hata oluştu:', error);
          this.toastService.error('Prensip silinirken hata oluştu.');
        }
      });
  }

  onStandartDelete(id: number): void {
    if (!confirm('Standartı silmek istediğinize emin misiniz?')) return;
    this.standartService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Standart silindi.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Standart silinirken hata oluştu:', error);
          this.toastService.error('Standart silinirken hata oluştu.');
        }
      });
  }

  // ==================== Prensip / Standart Mülga ====================

  onPrensipMulga(id: number): void {
    if (!confirm('Prensibi mülga yapmak istediğinize emin misiniz?')) return;
    this.prensipService.mulgaYap(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Prensip mülga yapıldı.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Prensip mülga yapılırken hata oluştu:', error);
          this.toastService.error('Prensip mülga yapılırken hata oluştu.');
        }
      });
  }

  onStandartMulga(id: number): void {
    if (!confirm('Standartı mülga yapmak istediğinize emin misiniz?')) return;
    this.standartService.mulgaYap(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Standart mülga yapıldı.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Standart mülga yapılırken hata oluştu:', error);
          this.toastService.error('Standart mülga yapılırken hata oluştu.');
        }
      });
  }

  // ==================== SurecAdim Inline Edit ====================

  onSurecAdimUpdate(event: { id: number; request: SurecAdimRequest }): void {
    this.surecAdimService.update(event.id, event.request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Süreç adımı güncellendi.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Süreç adımı güncellenirken hata oluştu:', error);
          this.toastService.error('Süreç adımı güncellenirken hata oluştu.');
        }
      });
  }

  onSurecAdimDelete(id: number): void {
    if (!confirm('Süreç adımını silmek istediğinize emin misiniz?')) return;
    this.surecAdimService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Süreç adımı silindi.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Süreç adımı silinirken hata oluştu:', error);
          this.toastService.error('Süreç adımı silinirken hata oluştu.');
        }
      });
  }

  onSurecAdimMulga(id: number): void {
    if (!confirm('Süreç adımını mülga yapmak istediğinize emin misiniz?')) return;
    this.surecAdimService.mulgaYap(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Süreç adımı mülga yapıldı.');
          this.reloadProsedur();
        },
        error: (error) => {
          console.error('Süreç adımı mülga yapılırken hata oluştu:', error);
          this.toastService.error('Süreç adımı mülga yapılırken hata oluştu.');
        }
      });
  }

  // ==================== Prensip / Standart / SurecAdim Add via Modal ====================

  openPrensipEkleDialog(): void {
    if (!this.prosedur?.id) return;
    const prosedurId = this.prosedur.id;
    const nextMaddeNo = (this.prosedur.prensipler?.length ?? 0) + 1;

    const dialogRef = this.dialog.open<PrensipRequest>(ProsedurPrensipDialogComponent, {
      data: { prosedurId, nextMaddeNo },
      width: '600px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.prensipService.create(result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('Prensip eklendi.');
                this.reloadProsedur();
              },
              error: (error) => {
                console.error('Prensip eklenirken hata oluştu:', error);
                this.toastService.error('Prensip eklenirken hata oluştu.');
              }
            });
        }
      });
  }

  openStandartEkleDialog(): void {
    if (!this.prosedur?.id) return;
    const prosedurId = this.prosedur.id;
    const nextMaddeNo = (this.prosedur.standartlar?.length ?? 0) + 1;

    const dialogRef = this.dialog.open<StandartRequest>(ProsedurStandartDialogComponent, {
      data: { prosedurId, nextMaddeNo },
      width: '600px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.standartService.create(result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('Standart eklendi.');
                this.reloadProsedur();
              },
              error: (error) => {
                console.error('Standart eklenirken hata oluştu:', error);
                this.toastService.error('Standart eklenirken hata oluştu.');
              }
            });
        }
      });
  }

  openSurecAdimEkleDialog(): void {
    if (!this.prosedur?.id) return;
    const prosedurId = this.prosedur.id;
    const nextMaddeNo = (this.prosedur.surecAdimlar?.length ?? 0) + 1;

    const dialogRef = this.dialog.open<SurecAdimRequest>(ProsedurSurecAdimDialogComponent, {
      data: { prosedurId, nextMaddeNo },
      width: '600px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.surecAdimService.create(result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('Süreç adımı eklendi.');
                this.reloadProsedur();
              },
              error: (error) => {
                console.error('Süreç adımı eklenirken hata oluştu:', error);
                this.toastService.error('Süreç adımı eklenirken hata oluştu.');
              }
            });
        }
      });
  }

  // ==================== Helpers ====================

  getDurumLabel(durumKodu: string | null | undefined): string {
    if (!durumKodu) return '';
    return PROSEDUR_DURUM_LABELS[durumKodu] || durumKodu;
  }

  getDurumBadgeClass(durumKodu: string | null | undefined): string {
    if (!durumKodu) return 'bg-secondary';
    return PROSEDUR_DURUM_BADGE_CLASS[durumKodu] || 'bg-secondary';
  }
}
