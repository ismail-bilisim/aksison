import { Component, OnInit, ViewChild, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EgitmenResponse } from '../../../../core/models/egitmen-response';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { EgitmenKategoriService } from 'src/app/core/services/api/egitmen-kategori.service';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ROLES } from 'src/app/core/config/roles';
import { EgitmenTemelComponent } from '../../components/egitmen-temel/egitmen-temel.component';
import { KategoriListComponent } from 'src/app/shared/components/kategori-list/kategori-list.component';
import { VideodersListComponent } from 'src/app/shared/components/videoders-list/videoders-list.component';
import { YuzyuzedersListComponent } from 'src/app/shared/components/yuzyuzeders-list/yuzyuzeders-list.component';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { Kategori } from 'src/app/core/models/kategori';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { ErrorHandler } from 'src/app/core/utils/error-handler';

@Component({
  selector: 'app-egitmen-detail-page',
  imports: [CommonModule, RouterModule, FormsModule, NgbNavModule, NgbModalModule, EgitmenTemelComponent, KategoriListComponent, VideodersListComponent, YuzyuzedersListComponent],
  templateUrl: './egitmen-detail-page.component.html',
  styleUrl: './egitmen-detail-page.component.css'
})
export class EgitmenDetailPageComponent implements OnInit {
  @ViewChild('kategoriList') kategoriList?: KategoriListComponent;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly egitmenService = inject(EgitmenService);
  private readonly egitmenKategoriService = inject(EgitmenKategoriService);
  private readonly kategoriService = inject(KategoriService);
  private readonly videodersService = inject(VideodersService);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly toastService = inject(ToastService);
  protected readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly ROLES = ROLES;

  egitmen$!: Observable<EgitmenResponse | null>;
  egitmenId!: number;
  isLoading = signal(false);
  
  kategoriler = signal<KategoriOzet[]>([]);
  kategoriLoading = signal(false);
  kategoriDeleting = signal(false);
  kategoriAdding = signal(false);
  kategoriModalLoading = signal(false);
  availableKategoriler = signal<Kategori[]>([]);
  kategoriLoaded = false; // Kategoriler yüklenip yüklenmediğini takip eder
  // Video dersler
  videodersler = signal<DersOzet[]>([]);
  videodersLoading = signal(false);
  videodersError = signal('');
  videodersLoaded = false;

  // Yüz yüze dersler
  yuzyuzedersler = signal<DersOzet[]>([]);
  yuzyuzedersLoading = signal(false);
  yuzyuzedersError = signal('');
  yuzyuzedersLoaded = false;
  activeTab = signal<number>(1);

  showApprovalModal = signal(false);
  approvalAction = signal<'approve' | 'reject'>('approve');
  approvalComment = signal<string>('');

  ngOnInit(): void {
    this.egitmen$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.egitmenId = id;
        if (!id) return of(null);
        
        return this.egitmenService.getFullById(id).pipe(
          catchError(err => {
            this.toastService.error('Eğitmen yüklenirken hata oluştu.');
            console.error(err);
            return of(null);
          })
        );
      })
    );
  }

  onTabChange(tabId: number): void {
    this.activeTab.set(tabId);
    if (tabId === 3 && !this.kategoriLoaded) {
      this.loadKategoriler();
      this.kategoriLoaded = true;
    }
    if (tabId === 4 && !this.videodersLoaded) {
      this.videodersLoaded = true;
      this.loadVideodersler();
    }
    if (tabId === 5 && !this.yuzyuzedersLoaded) {
      this.yuzyuzedersLoaded = true;
      this.loadYuzyuzedersler();
    }
  }

  loadKategoriler(): void {
    if (!this.egitmenId) {
      return;
    }
    
    this.kategoriLoading.set(true);
    this.egitmenKategoriService.getAllKategoriOzetByEgitmenId(this.egitmenId)
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
    if (!this.egitmenId) {
      return;
    }

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
    if (kategoriIds.length === 0) {
      return;
    }

    this.kategoriAdding.set(true);
    const requests = kategoriIds.map(kategoriId =>
      this.egitmenKategoriService.create({ egitmenId: this.egitmenId, kategoriId })
    );

    // Tüm istekleri paralel olarak gönder
    let completed = 0;
    const total = requests.length;
    
    requests.forEach(req => {
      req.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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
            ErrorHandler.logError(error, 'addKategoriler');
            this.toastService.error(ErrorHandler.extractErrorMessage(error));
            this.kategoriAdding.set(false);
          }
        });
    });
  }

  onKategoriDelete(kategoriId: number): void {
    this.kategoriDeleting.set(true);
    
    this.egitmenKategoriService.delete(this.egitmenId, kategoriId)
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

  private refreshEgitmen(): void {
    this.egitmen$ = this.egitmenService.getFullById(this.egitmenId).pipe(
      catchError(err => { console.error(err); return of(null); })
    );
    // Kategoriler sekmesi açıksa yeniden yükle
    if (this.kategoriLoaded) {
      this.loadKategoriler();
    }
  }

  edit(): void {
    this.router.navigate(['/egitmen/edit', this.egitmenId]);
  }

  submitForApproval(): void {
    if (this.egitmenId && confirm('Eğitmeni onay için sunmak istediğinizden emin misiniz?')) {
      this.isLoading.set(true);
      this.egitmenService.icerikOnayinaSun(this.egitmenId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.success('Eğitmen başarıyla onaya sunuldu.');
            this.isLoading.set(false);
            this.refreshEgitmen();
          },
          error: (err) => {
            this.toastService.error('Eğitmen onaya sunulurken hata oluştu.');
            console.error(err);
            this.isLoading.set(false);
          }
        });
    }
  }

  onayla(): void {
    this.approvalAction.set('approve');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  reddet(): void {
    this.approvalAction.set('reject');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  closeApprovalModal(): void {
    this.showApprovalModal.set(false);
    this.approvalComment.set('');
  }

  confirmApproval(): void {
    if (this.approvalAction() === 'approve') {
      this.handleApprove();
    } else {
      this.handleReject();
    }
  }

  private handleApprove(): void {
    this.isLoading.set(true);
    this.egitmenService.icerikOnayla(this.egitmenId, this.approvalComment())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Eğitmen başarıyla onaylanmıştır.');
          this.closeApprovalModal();
          this.isLoading.set(false);
          this.refreshEgitmen();
        },
        error: (err) => {
          this.toastService.error('Onay işlemi sırasında hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  private handleReject(): void {
    this.isLoading.set(true);
    this.egitmenService.icerikReddet(this.egitmenId, this.approvalComment())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Eğitmen reddedilmiştir.');
          this.closeApprovalModal();
          this.isLoading.set(false);
          this.refreshEgitmen();
        },
        error: (err) => {
          this.toastService.error('Red işlemi sırasında hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  pasifYap(): void {
    if (confirm('Eğitmeni pasif yapmak istediğinizden emin misiniz?')) {
      this.isLoading.set(true);
      this.egitmenService.pasifYap(this.egitmenId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.success('Eğitmen pasif yapıldı.');
            this.isLoading.set(false);
            this.refreshEgitmen();
          },
          error: (err) => {
            this.toastService.error('Pasif yapma işlemi sırasında hata oluştu.');
            console.error(err);
            this.isLoading.set(false);
          }
        });
    }
  }

  aktifYap(): void {
    if (confirm('Eğitmeni aktif yapmak istediğinizden emin misiniz?')) {
      this.isLoading.set(true);
      this.egitmenService.aktifYap(this.egitmenId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.success('Eğitmen aktif yapıldı.');
            this.isLoading.set(false);
            this.refreshEgitmen();
          },
          error: (err) => {
            this.toastService.error('Aktif yapma işlemi sırasında hata oluştu.');
            console.error(err);
            this.isLoading.set(false);
          }
        });
    }
  }

  onVideodersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/videoders/detail', id]);
    }
  }

  onYuzyuzedersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/yuzyuzeders/detail', id]);
    }
  }

  private loadVideodersler(): void {
    if (!this.egitmenId) return;
    this.videodersLoading.set(true);
    this.videodersError.set('');
    this.videodersService.getByEgitmenId(this.egitmenId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.videodersler.set(data);
          this.videodersLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadVideodersler');
          const msg = ErrorHandler.extractErrorMessage(error);
          this.videodersError.set(msg);
          this.toastService.error(msg);
          this.videodersLoading.set(false);
        }
      });
  }

  private loadYuzyuzedersler(): void {
    if (!this.egitmenId) return;
    this.yuzyuzedersLoading.set(true);
    this.yuzyuzedersError.set('');
    this.yuzyuzedersService.getByEgitmenId(this.egitmenId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.yuzyuzedersler.set(data);
          this.yuzyuzedersLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadYuzyuzedersler');
          const msg = ErrorHandler.extractErrorMessage(error);
          this.yuzyuzedersError.set(msg);
          this.toastService.error(msg);
          this.yuzyuzedersLoading.set(false);
        }
      });
  }
}
