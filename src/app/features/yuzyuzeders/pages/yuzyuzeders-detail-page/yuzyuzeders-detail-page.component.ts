import { Component, OnInit, inject, DestroyRef, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { OnayDurumu } from '../../../../core/models/onay-durumu.enum';
import { YuzyuzeDersResponse } from '../../../../core/models/yuzyuzeders-response';
import { YuzyuzedersService } from '../../../../core/services/api/yuzyuzeders.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { YuzyuzedersTemelComponent } from '../../components/yuzyuzeders-temel/yuzyuzeders-temel.component';
import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';
import { KategoriListComponent } from 'src/app/shared/components/kategori-list/kategori-list.component';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { YuzyuzedersKategoriService } from 'src/app/core/services/api/yuzyuzeders-kategori.service';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { Kategori } from 'src/app/core/models/kategori';
import { PaydasListComponent } from 'src/app/shared/components/paydas-list/paydas-list.component';
import { YuzyuzedersPaydasService } from 'src/app/core/services/api/yuzyuzeders-paydas.service';
import { PaydasService } from 'src/app/core/services/api/paydas.service';
import { PaydasOzet } from 'src/app/core/models/paydas-ozet';
import { IslemKayitListComponent } from 'src/app/shared/components/islem-kayit-list/islem-kayit-list.component';
import { YuzyuzedersIslemKayitService } from 'src/app/core/services/api/yuzyuzeders-islem-kayit.service';
import { IslemKayit } from 'src/app/core/models/islem-kayit';

@Component({
  selector: 'app-yuzyuzeders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    NgbNavModule,
    YuzyuzedersTemelComponent,
    KategoriListComponent,
    PaydasListComponent,
    IslemKayitListComponent
  ],
  templateUrl: './yuzyuzeders-detail-page.component.html',
  styleUrls: ['./yuzyuzeders-detail-page.component.css']
})
export class YuzyuzedersDetailPageComponent implements OnInit {
  @ViewChild('paydasList') paydasList?: PaydasListComponent;
  @ViewChild('kategoriList') kategoriList?: KategoriListComponent;
  yuzyuzeders?: YuzyuzeDersResponse;
  loading = false;
  activeTab = 'konular';
  submitting = false;
  
  // Enum for template
  readonly OnayDurumu = OnayDurumu;

  kategoriler = signal<KategoriOzet[]>([]);
  kategoriLoading = signal(false);
  kategoriDeleting = signal(false);
  kategoriAdding = signal(false);
  kategoriModalLoading = signal(false);
  availableKategoriler = signal<Kategori[]>([]);
  kategoriLoaded = false;

  paydaslar = signal<PaydasOzet[]>([]);
  paydasLoading = signal(false);
  paydasDeleting = signal(false);
  paydasAdding = signal(false);
  paydasModalLoading = signal(false);
  availablePaydaslar = signal<PaydasOzet[]>([]);
  paydasLoaded = false;

  islemKayitlar = signal<IslemKayit[]>([]);
  islemKayitLoading = signal(false);
  islemlerLoaded = false;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly yuzyuzedersKategoriService = inject(YuzyuzedersKategoriService);
  private readonly kategoriService = inject(KategoriService);
  private readonly yuzyuzedersPaydasService = inject(YuzyuzedersPaydasService);
  private readonly paydasService = inject(PaydasService);
  private readonly yuzyuzedersIslemKayitService = inject(YuzyuzedersIslemKayitService);
  private readonly dialog = inject(Dialog);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  // Modal input değerleri
  onayNotu: string = '';
  redNedeni: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadYuzyuzeders(+id);
    }
  }

  loadYuzyuzeders(id: number): void {
    this.loading = true;
    this.yuzyuzeders = undefined;

    this.yuzyuzedersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.yuzyuzeders = data;
          this.loading = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadYuzyuzeders');
          this.loading = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onTabChange(event: NgbNavChangeEvent): void {
    switch (event.nextId) {
      case 'kategoriler':
        if (!this.kategoriLoaded) {
          this.loadKategoriler();
          this.kategoriLoaded = true;
        }
        break;
      case 'paydaslar':
        if (!this.paydasLoaded) {
          this.loadPaydaslar();
          this.paydasLoaded = true;
        }
        break;
      case 'islemler':
        if (!this.islemlerLoaded) {
          this.loadIslemKayitlar();
          this.islemlerLoaded = true;
        }
        break;
      default:
        break;
    }
  }

  private loadKategoriler(): void {
    if (!this.yuzyuzeders?.id) return;

    this.kategoriLoading.set(true);
    this.yuzyuzedersKategoriService.getKategoriOzetByDersId(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.kategoriler.set(data);
          this.kategoriLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadKategoriler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.kategoriLoading.set(false);
        }
      });
  }

  onKategoriAddRequested(): void {
    if (!this.yuzyuzeders?.id) return;
    this.kategoriModalLoading.set(true);
    this.kategoriService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const mevcutIds = new Set(
            this.kategoriler()
              .map(k => k.id)
              .filter((id): id is number => id !== undefined)
          );
          this.availableKategoriler.set(
            data.filter((k): k is Kategori => k.id !== undefined && !mevcutIds.has(k.id))
          );
          this.kategoriModalLoading.set(false);
          setTimeout(() => this.kategoriList?.openKategoriModal(), 0);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadAvailableKategoriler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.kategoriModalLoading.set(false);
        }
      });
  }

  onKategoriAdd(kategoriIds: number[]): void {
    if (!this.yuzyuzeders?.id || kategoriIds.length === 0) return;

    this.kategoriAdding.set(true);
    const requests = kategoriIds.map(kategoriId => this.yuzyuzedersKategoriService.addKategori(this.yuzyuzeders!.id, kategoriId));

    let completed = 0;
    const total = requests.length;
    requests.forEach(req => {
      req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.toastService.success('Kategoriler başarıyla eklendi.');
            this.loadKategoriler();
            this.kategoriAdding.set(false);
            this.kategoriList?.closeKategoriModal();
          }
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addKategori');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.kategoriAdding.set(false);
        }
      });
    });
  }

  onKategoriDelete(kategoriId: number): void {
    if (!this.yuzyuzeders?.id) return;

    this.kategoriDeleting.set(true);
    this.yuzyuzedersKategoriService.deleteKategori(this.yuzyuzeders.id, kategoriId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Kategori başarıyla kaldırıldı.');
          this.loadKategoriler();
          this.kategoriDeleting.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteKategori');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.kategoriDeleting.set(false);
        }
      });
  }

  private loadPaydaslar(): void {
    if (!this.yuzyuzeders?.id) return;
    this.paydasLoading.set(true);
    this.yuzyuzedersPaydasService.getByDersId(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.paydaslar.set(data);
          this.paydasLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadPaydaslar');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.paydasLoading.set(false);
        }
      });
  }

  onPaydasAddRequested(): void {
    if (!this.yuzyuzeders?.id) return;
    this.paydasModalLoading.set(true);
    this.paydasService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const mevcutIds = new Set(this.paydaslar().map(p => p.id));
          this.availablePaydaslar.set(data.filter(p => !mevcutIds.has(p.id)));
          this.paydasModalLoading.set(false);
          setTimeout(() => this.paydasList?.openModal(), 0);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadAvailablePaydaslar');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.paydasModalLoading.set(false);
        }
      });
  }

  onPaydasAddConfirm(paydasIds: number[]): void {
    if (!this.yuzyuzeders?.id || paydasIds.length === 0) return;
    this.paydasAdding.set(true);
    const requests = paydasIds.map(id => this.yuzyuzedersPaydasService.addPaydas(this.yuzyuzeders!.id, id));

    let completed = 0;
    const total = requests.length;
    requests.forEach(req => {
      req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.toastService.success('Paydaşlar başarıyla eklendi.');
            this.loadPaydaslar();
            this.paydasAdding.set(false);
            this.paydasList?.closeModal();
          }
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addPaydaslar');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.paydasAdding.set(false);
        }
      });
    });
  }

  onPaydasDelete(item: PaydasOzet): void {
    if (!this.yuzyuzeders?.id || !item.id) return;
    this.paydasDeleting.set(true);
    this.yuzyuzedersPaydasService.deletePaydas(this.yuzyuzeders.id, item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Paydaş başarıyla kaldırıldı.');
          this.loadPaydaslar();
          this.paydasDeleting.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deletePaydas');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.paydasDeleting.set(false);
        }
      });
  }

  private loadIslemKayitlar(): void {
    if (!this.yuzyuzeders?.id) return;
    this.islemKayitLoading.set(true);
    this.yuzyuzedersIslemKayitService.getByDersId(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.islemKayitlar.set(data);
          this.islemKayitLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadIslemKayitlar');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.islemKayitLoading.set(false);
        }
      });
  }

  onEdit(id?: number): void {
    const dersId = id || this.yuzyuzeders?.id;
    if (dersId) {
      this.router.navigate(['/yuzyuzeders/edit', dersId]);
    }
  }

  icerikOnayinaSun(): void {
    if (!this.yuzyuzeders?.id) return;

    if (!confirm('İçeriği onaya sunmak istediğinize emin misiniz?')) {
      return;
    }

    this.submitting = true;
    this.yuzyuzedersService.icerikOnayinaSun(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('İçerik başarıyla onaya sunuldu.');
          this.loadYuzyuzeders(this.yuzyuzeders!.id);
          this.submitting = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'icerikOnayinaSun');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.submitting = false;
        }
      });
  }

  icerikOnayla(): void {
    if (!this.yuzyuzeders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: {
        title: 'İçerik Onay',
        message: 'İçeriği onaylamak istediğinize emin misiniz?',
        noteLabel: 'Onay Notu (İsteğe Bağlı)',
        confirmText: 'Onayla',
        appearance: 'approve'
      } as ApprovalDialogData,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined) {
          this.submitting = true;
          this.yuzyuzedersService.icerikOnayla(this.yuzyuzeders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('İçerik başarıyla onaylandı.');
                this.loadYuzyuzeders(this.yuzyuzeders!.id);
                this.submitting = false;
              },
              error: (error) => {
                ErrorHandler.logError(error, 'icerikOnayla');
                this.toastService.error(ErrorHandler.extractErrorMessage(error));
                this.submitting = false;
              }
            });
        }
      });
  }

  icerikReddet(): void {
    if (!this.yuzyuzeders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: {
        title: 'İçerik Red',
        message: 'İçeriği reddetmek istediğinize emin misiniz?',
        noteLabel: 'Red Nedeni (Zorunlu)',
        confirmText: 'Reddet',
        appearance: 'reject'
      } as ApprovalDialogData,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined) {
          this.submitting = true;
          this.yuzyuzedersService.icerikReddet(this.yuzyuzeders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('İçerik reddedildi.');
                this.loadYuzyuzeders(this.yuzyuzeders!.id);
                this.submitting = false;
              },
              error: (error) => {
                ErrorHandler.logError(error, 'icerikReddet');
                this.toastService.error(ErrorHandler.extractErrorMessage(error));
                this.submitting = false;
              }
            });
        }
      });
  }
}
