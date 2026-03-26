import { Component, OnInit, ViewChild, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { OnayDurumu } from 'src/app/core/models/onay-durumu.enum';
import { DersService } from 'src/app/core/services/api/ders.service';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { DersKategoriService } from 'src/app/core/services/api/ders-kategori.service';
import { DersBolumService } from 'src/app/core/services/api/ders-bolum.service';
import { BolumKonuService } from 'src/app/core/services/api/bolum-konu.service';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { DersIslemKayitService } from 'src/app/core/services/api/ders-islem-kayit.service';
import { DersTemelComponent } from '../../components/ders-temel/ders-temel.component';
import { DersKonuListComponent } from '../../components/ders-konu-list/ders-konu-list.component';
import { VideodersListComponent } from 'src/app/shared/components/videoders-list/videoders-list.component';
import { YuzyuzedersListComponent } from 'src/app/shared/components/yuzyuzeders-list/yuzyuzeders-list.component';
import { CanlidersListComponent } from 'src/app/shared/components/canliders-list/canliders-list.component';
import { CanlidersService } from 'src/app/core/services/api/canliders.service';
import { KategoriListComponent } from 'src/app/shared/components/kategori-list/kategori-list.component';
import { IslemKayitListComponent } from 'src/app/shared/components/islem-kayit-list/islem-kayit-list.component';
import { DersResponse } from 'src/app/core/models/ders-response';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { Kategori } from 'src/app/core/models/kategori';
import { DersBolumResponse, DersBolumRequest, BolumKonuRequest } from 'src/app/core/models/ders-bolum';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { IslemKayit } from 'src/app/core/models/islem-kayit';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { ToastService } from 'src/app/core/services/api/toast.service'; 
import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';
import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';

@Component({
  selector: 'app-ders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    NgbNavModule,
    NgbAccordionModule,
    DersTemelComponent,
    DersKonuListComponent,
    VideodersListComponent,
    YuzyuzedersListComponent,
    CanlidersListComponent,
    KategoriListComponent,
    IslemKayitListComponent,
  ],
  templateUrl: './ders-detail-page.component.html',
  styleUrls: ['./ders-detail-page.component.css']
})
export class DersDetailPageComponent implements OnInit {
  @ViewChild('kategoriList') kategoriList?: KategoriListComponent;

  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dersService = inject(DersService);
  private readonly kategoriService = inject(KategoriService);
  private readonly dersKategoriService = inject(DersKategoriService);
  private readonly dersBolumService = inject(DersBolumService);
  private readonly bolumKonuService = inject(BolumKonuService);
  private readonly videodersService = inject(VideodersService);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly canlidersService = inject(CanlidersService);
  private readonly dersIslemKayitService = inject(DersIslemKayitService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

  ders?: DersResponse;
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
  kategoriLoaded = false; // Kategoriler yüklenip yüklenmediğini takip eder

  // Konular / bölümler
  bolumlar = signal<DersBolumResponse[]>([]);
  bolumLoading = signal(false);

  // Video dersler
  videodersler = signal<DersOzet[]>([]);
  videodersLoading = signal(false);
  videodersError = signal('');

  // Yüzyüze dersler
  yuzyuzedersler = signal<DersOzet[]>([]);
  yuzyuzedersLoading = signal(false);
  yuzyuzedersError = signal('');

  // Canlı dersler
  canlidersler = signal<DersOzet[]>([]);
  canlidersLoading = signal(false);
  canlidersError = signal('');

  // İşlem kayıtları
  islemKayitlar = signal<IslemKayit[]>([]);
  islemKayitLoading = signal(false);


  // Sekmeler için lazy load bayrakları
  konularLoaded = true; // varsayılan sekme

  videoderslerLoaded = false;
  yuzyuzederslerLoaded = false;
  canliderslerLoaded = false;
  islemlerLoaded = false;
  paydasLoaded = false;
  egitmenLoaded = false;
  projelerLoaded = false;
  sorularLoaded = false;
  sozlesmelerLoaded = false;

  // Modal input değerleri
  onayNotu: string = '';
  redNedeni: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.loadDers(+id);
        console.log('Loading ders with ID from params:', id);
      } else {
        // Try to get ID from snapshot as fallback
        const snapshotId = this.route.snapshot.paramMap.get('id');
        console.log('Trying snapshot ID:', snapshotId);

        if (snapshotId && !isNaN(+snapshotId)) {
          this.loadDers(+snapshotId);

          // Kategori verilerini yükle
          this.loadKategoriler(+snapshotId);

        } else {
          console.error('No valid ID found in route params or snapshot');
          console.log('Full route snapshot:', this.route.snapshot);
          this.loading = false;
        }
      }
    });
  }

  loadDers(id: number): void {
    console.log('Loading ders with ID:', id);
    this.loading = true;
    this.ders = undefined;

    this.dersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('DersDetailPageComponent - Loaded ders:', data);
          this.ders = data;
          this.loading = false;

          // Varsayılan tab konular: bölümleri yükle
          this.loadBolumlar();
       },
        error: (error) => {
          ErrorHandler.logError(error, 'loadDers');
          this.loading = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  private loadBolumlar(): void {
    const id = this.ders?.id;
    if (!id) return;

    this.bolumLoading.set(true);
    this.dersBolumService.getAllByDersIdOrdered(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (bolumler) => {
          // Her bölümün konularını getir
          const enriched = bolumler.map(b => ({ ...b, bolum: { ...b.bolum, bolumKonular: [] }}));
          this.bolumlar.set(enriched);

          bolumler.forEach((bolum, index) => {
            this.bolumKonuService.getAllByBolumIdOrdered(bolum.bolum.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (konular) => {
                  const current = this.bolumlar();
                  current[index] = { ...current[index], bolum: { ...current[index].bolum, bolumKonular: konular } } as DersBolumResponse;
                  this.bolumlar.set([...current]);
                },
                error: (error) => {
                  ErrorHandler.logError(error, 'loadBolumlar.konular');
                  this.toastService.error(ErrorHandler.extractErrorMessage(error));
                }
              });
          });

          this.bolumLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadBolumlar');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.bolumLoading.set(false);
        }
      });
  }

  onSaveBolum(request: DersBolumRequest): void {
    this.bolumLoading.set(true);
    this.dersBolumService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Bölüm başarıyla eklendi.');
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'saveBolum');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.bolumLoading.set(false);
        }
      });
  }

  onDeleteBolum(dersBolumId: number): void {
    this.bolumLoading.set(true);
    this.dersBolumService.delete(dersBolumId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Bölüm başarıyla silindi.');
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteBolum');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.bolumLoading.set(false);
        }
      });
  }

  onSaveKonu(request: BolumKonuRequest): void {
    this.bolumLoading.set(true);
    this.bolumKonuService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Konu başarıyla eklendi.');
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'saveKonu');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.bolumLoading.set(false);
        }
      });
  }

  onDeleteKonu(bolumKonuId: number): void {
    this.bolumLoading.set(true);
    this.bolumKonuService.delete(bolumKonuId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Konu başarıyla silindi.');
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteKonu');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.bolumLoading.set(false);
        }
      });
  }

  private loadVideodersler(): void {
    if (!this.ders?.id) return;
    this.videodersLoading.set(true);
    this.videodersError.set('');
    this.videodersService.getByDersId(this.ders.id)
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
    if (!this.ders?.id) return;
    this.yuzyuzedersLoading.set(true);
    this.yuzyuzedersError.set('');
    this.yuzyuzedersService.getByDersId(this.ders.id)
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

  private loadCanlidersler(): void {
    if (!this.ders?.id) return;
    this.canlidersLoading.set(true);
    this.canlidersError.set('');
    this.canlidersService.getByDersId(this.ders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.canlidersler.set(data);
          this.canlidersLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadCanlidersler');
          const msg = ErrorHandler.extractErrorMessage(error);
          this.canlidersError.set(msg);
          this.toastService.error(msg);
          this.canlidersLoading.set(false);
        }
      });
  }

  onCanlidersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/canliders/detail', id]);
    }
  }


  private loadIslemKayitlar(): void {
    if (!this.ders?.id) return;
    this.islemKayitLoading.set(true);
    this.dersIslemKayitService.getByDersId(this.ders.id)
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

  loadKategoriler(dersId?: number): void {
    const id = dersId || this.ders?.id;
    if (!id) {
      console.log('loadKategoriler: ID bulunamadı');
      return;
    }
    
    console.log('loadKategoriler: Derse eklenmiş Kategoriler yüklenmeye başlandı, ID:', id);
    this.kategoriLoading.set(true);
    this.dersKategoriService.getKategoriOzetByDersId(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('loadKategoriler Ders: API yanıtı:', data);
          this.kategoriler.set(data);
          this.kategoriLoading.set(false);
        },
        error: (error) => {
          console.error('loadKategoriler: Hata:', error);
          ErrorHandler.logError(error, 'loadKategoriler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.kategoriLoading.set(false);
        }
      });
  }

  onKategoriAddRequested(): void {
    if (!this.ders?.id) {
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
    if (kategoriIds.length === 0 || !this.ders?.id) {
      return;
    }

    this.kategoriAdding.set(true);
    const requests = kategoriIds.map(kategoriId =>
      this.dersKategoriService.addKategori(this.ders!.id, kategoriId)
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
    if (!this.ders?.id) {
      return;
    }
    
    this.kategoriDeleting.set(true);
    
    this.dersKategoriService.deleteKategori(this.ders.id, kategoriId)
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

  onEdit(dersId: number): void {
    if (dersId) {
      this.router.navigate(['/ders/edit', dersId]);
    }
  }

  onTabChange(tabId: string): void {
    console.log('Tab değişti:', tabId);
    if (tabId === 'kategoriler' && !this.kategoriLoaded) {
      console.log('Kategoriler tabı açıldı, kategoriler yüklenecek');
      this.loadKategoriler();
      this.kategoriLoaded = true;
    }

    if (tabId === 'konular') {
      this.konularLoaded = true;
      this.loadBolumlar();
    } else if (tabId === 'videodersler') {
      this.videoderslerLoaded = true;
      this.loadVideodersler();
    } else if(tabId==="yuzyuzedersler") {
      this.yuzyuzederslerLoaded = true;
      this.loadYuzyuzedersler();
    } else if (tabId === 'canlidersler') {
      this.canliderslerLoaded = true;
      this.loadCanlidersler();
    }
    
    else if (tabId === 'dersislemkayitlar') {
      this.islemlerLoaded = true;
      this.loadIslemKayitlar();
    } else if (tabId === 'paydaslar') {
      this.paydasLoaded = true;
    } else if (tabId === 'egitmenler') {
      this.egitmenLoaded = true;
    } else if (tabId === 'projeler') {
      this.projelerLoaded = true;
    } else if (tabId === 'sorular') {
      this.sorularLoaded = true;
    } else if (tabId === 'sozlesmeler') {
      this.sozlesmelerLoaded = true;
    }
  }

  onBack(): void {
    this.router.navigate(['/ders']);
  }

  baslatmaOnayinaSun(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }
    this.submitting = true;
    this.dersService.baslatmaOnayinaSun(this.ders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.ders = updated;
          this.submitting = false;
          this.toastService.success('Ders başarıyla onaya gönderildi.');
        },
        error: (error) => {
          ErrorHandler.logError(error, 'baslatmaOnayinaSun');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  baslatmaOnayla(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }

    const data: ApprovalDialogData = {
      title: 'Başlatma Onayı',
      message: 'isimli dersin başlatılmasını onaylamak istediğinizden emin misiniz?',
      entityName: this.ders.adi,
      noteLabel: 'Onay Notu (opsiyonel)',
      placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
      additionalInfo: 'Onaylanan derse otomatik olarak bir ders kodu atanacaktır.',
      confirmText: 'Onayla',
      cancelText: 'İptal',
      appearance: 'approve'
    };

    const ref = this.dialog.open<string | null>(ApprovalDialogComponent, { data });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.onayNotu = result;
        this.onaylaIslemi();
      }
    });
  }

  private onaylaIslemi(): void {
    if (!this.ders?.id) return;
    
    this.submitting = true;
    this.dersService.baslatmaOnayla(this.ders.id, this.onayNotu || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.ders = updated;
          this.submitting = false;
          this.toastService.success(`Ders içeriği onaylandı. Ders kodu: ${updated.kodu}`);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'baslatmaOnayla');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  baslatmaReddet(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }

    const data: ApprovalDialogData = {
      title: 'İçerik Reddi',
      message: 'isimli dersin içeriğini reddetmek istediğinizden emin misiniz?',
      entityName: this.ders.adi,
      noteLabel: 'Red Nedeni (opsiyonel)',
      placeholder: 'İsteğe bağlı red nedeninizi buraya yazabilirsiniz...',
      additionalInfo: 'Reddedilen ders taslak durumuna dönecektir.',
      confirmText: 'Reddet',
      cancelText: 'İptal',
      appearance: 'reject'
    };

    const ref = this.dialog.open<string | null>(ApprovalDialogComponent, { data });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.redNedeni = result;
        this.reddetIslemi();
      }
    });
  }

  private reddetIslemi(): void {
    if (!this.ders?.id) return;
    
    this.submitting = true;
    this.dersService.baslatmaReddet(this.ders.id, this.redNedeni || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.ders = updated;
          this.submitting = false;
          this.toastService.info('Ders içeriği reddedildi.');
        },
        error: (error) => {
          ErrorHandler.logError(error, 'baslatmaReddet');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }
}
