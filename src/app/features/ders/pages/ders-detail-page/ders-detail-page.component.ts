import { Component, OnInit, inject, ViewChild, TemplateRef, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbAccordionModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DersService } from 'src/app/core/services/api/ders.service';
import { DersKategoriService } from 'src/app/core/services/api/ders-kategori.service';
import { DersBolumService } from 'src/app/core/services/api/ders-bolum.service';
import { BolumKonuService } from 'src/app/core/services/api/bolum-konu.service';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { DersIslemKayitService } from 'src/app/core/services/api/ders-islem-kayit.service';
import { DersTemelComponent } from '../../components/ders-temel/ders-temel.component';
import { DersKonuListComponent } from '../../components/ders-konu-list/ders-konu-list.component';
import { DersVideodersListComponent } from '../../components/ders-videoders-list/ders-videoders-list.component';
import { KategoriListComponent } from 'src/app/shared/components/kategori-list/kategori-list.component';
import { IslemKayitListComponent } from 'src/app/shared/components/islem-kayit-list/islem-kayit-list.component';
import { DersResponse } from 'src/app/core/models/ders-response';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { DersBolumResponse, DersBolumRequest, BolumKonuRequest } from 'src/app/core/models/ders-bolum';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { DersIslemKayit } from 'src/app/core/models/ders-islem-kayit';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { ToastService } from 'src/app/core/services/api/toast.service'; 

@Component({
  selector: 'app-ders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbModalModule,
    DersTemelComponent,
    DersKonuListComponent,
    DersVideodersListComponent,
    KategoriListComponent,
    IslemKayitListComponent
  ],
  templateUrl: './ders-detail-page.component.html',
  styleUrls: ['./ders-detail-page.component.css']
})
export class DersDetailPageComponent implements OnInit {

  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dersService = inject(DersService);
  private readonly dersKategoriService = inject(DersKategoriService);
  private readonly dersBolumService = inject(DersBolumService);
  private readonly bolumKonuService = inject(BolumKonuService);
  private readonly videodersService = inject(VideodersService);
  private readonly dersIslemKayitService = inject(DersIslemKayitService);
  private readonly modalService = inject(NgbModal);
  private readonly destroyRef = inject(DestroyRef);

  ders?: DersResponse;
  loading = false;
  activeTab = 'konular';
  submitting = false;
  
  kategoriler = signal<KategoriOzet[]>([]);
  kategoriLoading = signal(false);
  kategoriDeleting = signal(false);
  kategoriAdding = signal(false);
  kategoriLoaded = false; // Kategoriler yüklenip yüklenmediğini takip eder

  // Konular / bölümler
  bolumlar = signal<DersBolumResponse[]>([]);
  bolumLoading = signal(false);

  // Video dersler
  videodersler = signal<DersOzet[]>([]);
  videodersLoading = signal(false);
  videodersError = signal('');

  // İşlem kayıtları
  islemKayitlar = signal<DersIslemKayit[]>([]);
  islemKayitLoading = signal(false);

  // Sekmeler için lazy load bayrakları
  konularLoaded = true; // varsayılan sekme
  videoderslerLoaded = false;
  islemlerLoaded = false;

  // Modal referansları
  @ViewChild('onayModal') onayModalTemplate!: TemplateRef<any>;
  @ViewChild('redModal') redModalTemplate!: TemplateRef<any>;
  
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
    } else if (tabId === 'dersislemkayitlar') {
      this.islemlerLoaded = true;
      this.loadIslemKayitlar();
    }
  }

  onBack(): void {
    this.router.navigate(['/ders']);
  }

  icerikOnayinaSun(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }
    this.submitting = true;
    this.dersService.icerikOnayinaSun(this.ders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.ders = updated;
          this.submitting = false;
          this.toastService.success('Ders başarıyla onaya gönderildi.');
        },
        error: (error) => {
          ErrorHandler.logError(error, 'icerikOnayinaSun');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  icerikOnayla(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }
    
    // Modal aç
    this.onayNotu = '';
    this.modalService.open(this.onayModalTemplate, { centered: true }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.onaylaIslemi();
        }
      },
      () => {
        // Modal dismissed (cancelled)
      }
    );
  }

  private onaylaIslemi(): void {
    if (!this.ders?.id) return;
    
    this.submitting = true;
    this.dersService.icerikOnayla(this.ders.id, this.onayNotu || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.ders = updated;
          this.submitting = false;
          this.toastService.success(`Ders içeriği onaylandı. Ders kodu: ${updated.kodu}`);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'icerikOnayla');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  icerikReddet(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }
    
    // Modal aç
    this.redNedeni = '';
    this.modalService.open(this.redModalTemplate, { centered: true }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.reddetIslemi();
        }
      },
      () => {
        // Modal dismissed (cancelled)
      }
    );
  }

  private reddetIslemi(): void {
    if (!this.ders?.id) return;
    
    this.submitting = true;
    this.dersService.icerikReddet(this.ders.id, this.redNedeni || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.ders = updated;
          this.submitting = false;
          this.toastService.info('Ders içeriği reddedildi.');
        },
        error: (error) => {
          ErrorHandler.logError(error, 'icerikReddet');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }
}
