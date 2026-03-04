import { VideodersProjeService } from 'src/app/core/services/api/videoders-proje.service';
import { ProjeService } from 'src/app/core/services/api/proje.service';
import { ProjeOzet } from 'src/app/core/models/proje-ozet';
import { VideodersEgitmenService } from 'src/app/core/services/api/videoders-egitmen.service';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { Component, OnInit, inject, ViewChild, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbAccordionModule, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DersDurumu } from '../../../../core/models/ders-durumu.enum';
import { VideoDersResponse} from '../../../../core/models/videoders-response';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { VideodersKategoriService } from '../../../../core/services/api/videoders-kategori.service';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { KategoriOzet } from '../../../../core/models/kategori-ozet';
import { Kategori } from 'src/app/core/models/kategori';
import { VideodersTemelComponent } from '../../components/videoders-temel/videoders-temel.component';
import { KonuListComponent } from 'src/app/shared/components/konu-list/konu-list.component';
import { VideodersSorumlularComponent } from '../../components/videoders-sorumlular/videoders-sorumlular.component';
import { VideodersUcretComponent } from '../../components/videoders-ucret/videoders-ucret.component';
import { VideodersOnkosulListComponent } from '../../components/videoders-onkosul-list/videoders-onkosul-list.component';
import { KategoriListComponent } from 'src/app/shared/components/kategori-list/kategori-list.component';
import { ProjeListComponent } from 'src/app/shared/components/proje-list/proje-list.component';
import { SozlesmeListComponent } from 'src/app/shared/components/sozlesme-list/sozlesme-list.component';
import { IslemKayitListComponent } from 'src/app/shared/components/islem-kayit-list/islem-kayit-list.component';
import { VideoDersIslemKayitService } from 'src/app/core/services/api/videoders-islem-kayit.service';
import { IslemKayit } from 'src/app/core/models/islem-kayit';
import { VideodersOzetComponent } from '../../components/videoders-ozet/videoders-ozet.component';
import { SoruListComponent } from 'src/app/shared/components/soru-list/soru-list.component';
import { EgitmenListComponent } from 'src/app/shared/components/egitmen-list/egitmen-list.component';
import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';
import { PaydasListComponent } from 'src/app/shared/components/paydas-list/paydas-list.component';
import { PaydasOzet } from 'src/app/core/models/paydas-ozet';
import { VideodersPaydasService } from 'src/app/core/services/api/videoders-paydas.service';
import { PaydasService } from 'src/app/core/services/api/paydas.service';
import { MateryalListComponent } from 'src/app/shared/components/materyal-list/materyal-list.component';
import { VideodersMateryalService } from 'src/app/core/services/api/videoders-materyal.service';
import { VideodersMateryalResponse } from 'src/app/core/models/videoders-materyal-response';
import { MedyaTuruOzet } from 'src/app/core/models/medya-turu-ozet';
import { UcretBilgisiDialogComponent, UcretBilgisiDialogData, UcretBilgisiDialogResult } from 'src/app/shared/components/ucret-bilgisi-dialog/ucret-bilgisi-dialog.component';

@Component({
  selector: 'app-videoders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    NgbNavModule,
    NgbAccordionModule,
    VideodersTemelComponent,
    KonuListComponent,
    VideodersSorumlularComponent,
    VideodersUcretComponent,
    VideodersOzetComponent,
    VideodersOnkosulListComponent,
    KategoriListComponent,
    ProjeListComponent,
    PaydasListComponent,
    SozlesmeListComponent,
    IslemKayitListComponent,
    SoruListComponent,
    EgitmenListComponent,
    MateryalListComponent
],
  templateUrl: './videoders-detail-page.component.html',
  styleUrls: ['./videoders-detail-page.component.css']
})
export class VideodersDetailPageComponent implements OnInit {
  @ViewChild('egitmenList') egitmenList?: EgitmenListComponent;
  @ViewChild('paydasList') paydasList?: PaydasListComponent;
  @ViewChild('kategoriList') kategoriList?: KategoriListComponent;
  @ViewChild('projeList') projeList?: ProjeListComponent;
  @ViewChild('materyalList') materyalList?: MateryalListComponent;
  
  videoders?: VideoDersResponse;
  loading = false;
  activeTab = 'konular';
  submitting = false;
  
  // Enum for template
  readonly DersDurumu = DersDurumu;
  
  kategoriler = signal<KategoriOzet[]>([]);
  kategoriLoading = signal(false);
  kategoriDeleting = signal(false);
  kategoriAdding = signal(false);
  kategoriModalLoading = signal(false);
  availableKategoriler = signal<Kategori[]>([]);
  kategoriLoaded = false; // Kategoriler yüklenip yüklenmediğini takip eder

  paydaslar = signal<PaydasOzet[]>([]);
  paydasLoading = signal(false);
  paydasDeleting = signal(false);
  paydasAdding = signal(false);
  paydasModalLoading = signal(false);
  availablePaydaslar = signal<PaydasOzet[]>([]);
  paydasLoaded = false;

  egitmenler = signal<EgitmenOzet[]>([]);
  egitmenLoading = signal(false);
  egitmenAssigning = signal(false);
  egitmenModalLoading = signal(false);
  availableEgitmenler = signal<EgitmenOzet[]>([]);
  egitmenLoaded = false;

  projeler = signal<ProjeOzet[]>([]);
  projeLoading = signal(false);
  projeDeleting = signal(false);
  projeAdding = signal(false);
  projeModalLoading = signal(false);
  availableProjeler = signal<ProjeOzet[]>([]);
  projelerLoaded = false;

  materyaller = signal<VideodersMateryalResponse[]>([]);
  materyalLoading = signal(false);
  materyalDeleting = signal(false);
  materyalUploading = signal(false);
  materyalModalLoading = signal(false);
  availableMedyaTurleri = signal<MedyaTuruOzet[]>([]);
  materyalLoaded = false;

  // İşlem kayıtları için
  videoDersIslemKayitlar = signal<IslemKayit[]>([]);
  videoDersIslemKayitLoading = signal(false);

  // Diğer sekmeler için lazy load bayrakları
  konularLoaded = true; // varsayılan sekme
  sorularLoaded = false;
  sozlesmelerLoaded = false;
  islemlerLoaded = false;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly videodersService = inject(VideodersService);
  private readonly videodersKategoriService = inject(VideodersKategoriService);
  private readonly kategoriService = inject(KategoriService);
  private readonly videodersEgitmenService = inject(VideodersEgitmenService);
  private readonly egitmenService = inject(EgitmenService);
  private readonly videodersProjeService = inject(VideodersProjeService);
  private readonly projeService = inject(ProjeService);
  private readonly videoDersIslemKayitService = inject(VideoDersIslemKayitService);
  private readonly videodersPaydasService = inject(VideodersPaydasService);
  private readonly paydasService = inject(PaydasService);
  private readonly videodersMateryalService = inject(VideodersMateryalService);
  private readonly dialog = inject(Dialog);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  // Modal input değerleri
  onayNotu: string = '';
  redNedeni: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.loadVideoders(+id);
        console.log('Loading videoders with Kodu from params:', id);
      } else {
        // Try to get ID from snapshot as fallback
        const snapshotId = this.route.snapshot.paramMap.get('id');
        console.log('Trying snapshot ID:', snapshotId);

        if (snapshotId && !isNaN(+snapshotId)) {
          this.loadVideoders(+snapshotId);
        } else {
          console.error('No valid ID found in route params or snapshot');
          console.log('Full route snapshot:', this.route.snapshot);
          this.loading = false;
        }
      }
    });
  }

  loadVideoders(id: number): void {
    console.log('Loading videoders with ID:', id);
    this.loading = true;
    this.videoders = undefined;

    this.videodersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('VideodersDetailPageComponent - Loaded videoders:', data);
          this.videoders = data;
          this.loading = false;
          
          // Kategoriler tab'a tıklanınca yüklenecek, burada yüklenmiyor
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadVideoders');
          this.loading = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

    onTabChange(event: NgbNavChangeEvent): void {
    console.log('Tab değişti:', event.nextId);
    switch (event.nextId) {
      case 'kategoriler':
        if (!this.kategoriLoaded) {
          console.log('Kategoriler tabı açıldı, kategoriler yüklenecek');
          this.loadKategoriler();
          this.kategoriLoaded = true;
        }
        break;
      case 'konular':
        this.konularLoaded = true;
        break;
      case 'sorular':
        this.sorularLoaded = true;
        break;
      case 'egitmenler':
        if (!this.egitmenLoaded) {
          this.loadEgitmenler();
        }
        break;
      case 'projeler':
        if (!this.projelerLoaded) {
          this.loadProjeler();
        }
        break;
      case 'paydaslar':
        if (!this.paydasLoaded) {
          this.loadPaydaslar();
          this.paydasLoaded = true;
        }
        break;
      case 'materyaller':
        if (!this.materyalLoaded) {
          this.loadMateryaller();
          this.materyalLoaded = true;
        }
        break;
      case 'sozlesmeler':
        this.sozlesmelerLoaded = true;
        break;
      case 'islemler':
        this.islemlerLoaded = true;
        this.loadVideoDersIslemKayitlar();
        break;
    }
  }



  loadKategoriler(dersId?: number): void {
    const id = dersId || this.videoders?.id;
    if (!id) {
      console.log('loadKategoriler: ID bulunamadı');
      return;
    }
    
    console.log('loadKategoriler: Kategoriler yüklenmeye başlandı, ID:', id);
    this.kategoriLoading.set(true);
    this.videodersKategoriService.getKategoriOzetByDersId(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('loadKategoriler: API yanıtı:', data);
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
    if (!this.videoders?.id) return;

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
    if (kategoriIds.length === 0 || !this.videoders?.id) {
      return;
    }

    this.kategoriAdding.set(true);
    const requests = kategoriIds.map(kategoriId =>
      this.videodersKategoriService.addKategori(this.videoders!.id, kategoriId)
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
    if (!this.videoders?.id) {
      return;
    }
    
    this.kategoriDeleting.set(true);
    
    this.videodersKategoriService.deleteKategori(this.videoders.id, kategoriId)
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

  onKategoriSelect(kategoriId: number): void {
    if (kategoriId) {
      this.router.navigate(['/kategori/detail', kategoriId]);
    }
  }

  onEgitmenSelect(egitmenId: number): void {
    if (egitmenId) {
      this.router.navigate(['/egitmen/detail', egitmenId]);
    }
  }

  onProjeSelect(projeId: number): void {
    if (projeId) {
      this.router.navigate(['/proje/detail', projeId]);
    }
  }

  onPaydasSelect(paydasId: number): void {
    if (paydasId) {
      this.router.navigate(['/paydas/detail', paydasId]);
    }
  }

  private loadPaydaslar(): void {
    if (!this.videoders?.id) return;

    this.paydasLoading.set(true);
    this.videodersPaydasService.getByDersId(this.videoders.id)
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
    if (!this.videoders?.id) return;

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
    if (!this.videoders?.id || paydasIds.length === 0) return;

    this.paydasAdding.set(true);
    const requests = paydasIds.map(id => this.videodersPaydasService.addPaydas(this.videoders!.id, id));

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
    if (!this.videoders?.id || !item.id) return;

    this.paydasDeleting.set(true);
    this.videodersPaydasService.deletePaydas(this.videoders.id, item.id)
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

  private loadEgitmenler(): void {
    if (!this.videoders?.id) return;

    this.egitmenLoading.set(true);
    this.videodersEgitmenService.getByDersId(this.videoders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.egitmenler.set(data);
          this.egitmenLoading.set(false);
          this.egitmenLoaded = true;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadEgitmenler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.egitmenLoading.set(false);
        }
      });
  }

  onEgitmenAddRequested(searchTerm?: string): void {
    if (!this.videoders?.id) return;
    this.egitmenModalLoading.set(true);
    this.egitmenService.searchApproved(searchTerm || '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const mevcutIds = new Set(this.egitmenler().map(e => e.id));
          this.availableEgitmenler.set((data || []).filter(e => !mevcutIds.has(e.id)));
          this.egitmenModalLoading.set(false);
          setTimeout(() => this.egitmenList?.openModal(), 0);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadAvailableEgitmenler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.egitmenModalLoading.set(false);
        }
      });
  }

  onEgitmenAddConfirm(egitmenIds: number[]): void {
    if (!this.videoders?.id || egitmenIds.length === 0) return;

    this.egitmenAssigning.set(true);
    const requests = egitmenIds.map(id => this.videodersEgitmenService.addEgitmen(this.videoders!.id, id));
    let completed = 0;
    const total = requests.length;
    requests.forEach(req => {
      req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.toastService.success('Eğitmen(ler) başarıyla atandı');
            this.loadEgitmenler();
            this.egitmenAssigning.set(false);
            this.egitmenList?.closeModal();
          }
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addEgitmen');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.egitmenAssigning.set(false);
        }
      });
    });
  }

  onEgitmenDelete(id: number): void {
    if (!this.videoders?.id || !id) return;
    this.egitmenLoading.set(true);
    this.videodersEgitmenService.deleteEgitmen(this.videoders.id, id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Eğitmen kaldırıldı');
          this.egitmenLoading.set(false);
          this.loadEgitmenler();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteEgitmen');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.egitmenLoading.set(false);
        }
      });
  }

  private loadProjeler(): void {
    if (!this.videoders?.id) return;
    this.projeLoading.set(true);
    this.videodersProjeService.getByDersId(this.videoders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.projeler.set(data);
          this.projeLoading.set(false);
          this.projelerLoaded = true;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadProjeler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.projeLoading.set(false);
        }
      });
  }

  onProjeAddRequested(): void {
    if (!this.videoders?.id) return;
    this.projeModalLoading.set(true);
    this.projeService.getAllOzet()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const mevcutIds = new Set(this.projeler().map(p => p.id));
          this.availableProjeler.set(data.filter(p => !mevcutIds.has(p.id)));
          this.projeModalLoading.set(false);
          setTimeout(() => this.projeList?.openModal(), 0);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadAvailableProjeler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.projeModalLoading.set(false);
        }
      });
  }

  onProjeAddConfirm(projeIds: number[]): void {
    if (!this.videoders?.id || projeIds.length === 0) return;
    this.projeAdding.set(true);
    const requests = projeIds.map(id => this.videodersProjeService.addProje(this.videoders!.id, id));
    let completed = 0;
    const total = requests.length;
    requests.forEach(req => {
      req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.toastService.success('Projeler başarıyla eklendi.');
            this.loadProjeler();
            this.projeAdding.set(false);
            this.projeList?.closeModal();
          }
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addProjeler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.projeAdding.set(false);
        }
      });
    });
  }

  onProjeDelete(item: ProjeOzet): void {
    if (!this.videoders?.id || !item.id) return;
    this.projeDeleting.set(true);
    this.videodersProjeService.deleteProje(this.videoders.id, item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Proje başarıyla kaldırıldı.');
          this.loadProjeler();
          this.projeDeleting.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteProje');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.projeDeleting.set(false);
        }
      });
  }

  private loadVideoDersIslemKayitlar(): void {
    if (!this.videoders?.id) return;
    this.videoDersIslemKayitLoading.set(true);
    this.videoDersIslemKayitService.getByDersId(this.videoders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.videoDersIslemKayitlar.set(data);
          this.videoDersIslemKayitLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadVideoDersIslemKayitlar');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.videoDersIslemKayitLoading.set(false);
        }
      });
  }

  onEdit(videodersId: number): void {
    if (videodersId) {
      this.router.navigate(['/videoders/edit', videodersId]);
    }
  }

  baslatmaOnayinaSun(): void {
    if (!this.videoders?.id || this.submitting) {
      return;
    }
    this.submitting = true;
    this.videodersService.baslatmaOnayinaSun(this.videoders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.videoders = updated;
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
    if (!this.videoders?.id || this.submitting) {
      return;
    }

    const data: ApprovalDialogData = {
      title: 'Başlatma Onayı',
      message: 'isimli dersin başlatılmasını onaylamak istediğinizden emin misiniz?',
      entityName: this.videoders.adi,
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
    if (!this.videoders?.id) return;

    this.submitting = true;
    this.videodersService.baslatmaOnayla(this.videoders.id, this.onayNotu || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.videoders = updated;
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
    if (!this.videoders?.id || this.submitting) {
      return;
    }

    const data: ApprovalDialogData = {
      title: 'İçerik Reddi',
      message: 'isimli dersin içeriğini reddetmek istediğinizden emin misiniz?',
      entityName: this.videoders.adi,
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
    if (!this.videoders?.id) return;

    this.submitting = true;
    this.videodersService.baslatmaReddet(this.videoders.id, this.redNedeni || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.videoders = updated;
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

  // ==================== Workflow İşlemleri ====================

  /**
   * Generic workflow işlemi helper metodu.
   * ApprovalDialog açar, kullanıcıdan onay/not alır, ardından servis çağrısı yapar.
   */
  private workflowIslemYap(
    serviceFn: (id: number, not?: string) => import('rxjs').Observable<VideoDersResponse>,
    dialogData: ApprovalDialogData,
    basariMesaji: string,
    islemAdi: string
  ): void {
    if (!this.videoders?.id || this.submitting) return;

    const ref = this.dialog.open<string | null>(ApprovalDialogComponent, { data: dialogData });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result !== null && result !== undefined) {
        this.submitting = true;
        serviceFn(this.videoders!.id, result || undefined)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (updated) => {
              this.videoders = updated;
              this.submitting = false;
              this.toastService.success(basariMesaji);
            },
            error: (error) => {
              ErrorHandler.logError(error, islemAdi);
              this.submitting = false;
              this.toastService.error(ErrorHandler.extractErrorMessage(error));
            }
          });
      }
    });
  }

  // --- İçerik İşlemleri ---

  icerigiEgitmeneGonder(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.icerigiEgitmeneGonder(id, not),
      {
        title: 'İçeriği Eğitmene Gönder',
        message: 'isimli dersin içeriğini eğitmene göndermek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Eğitmene Gönder',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'İçerik başarıyla eğitmene gönderildi.',
      'icerigiEgitmeneGonder'
    );
  }

  icerigiOnayaSun(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.icerigiOnayaSun(id, not),
      {
        title: 'İçeriği Onaya Sun',
        message: 'isimli dersin içeriğini onaya sunmak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onaya Sun',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'İçerik başarıyla onaya sunuldu.',
      'icerigiOnayaSun'
    );
  }

  icerikOnayla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.icerikOnayla(id, not),
      {
        title: 'İçerik Onayı',
        message: 'isimli dersin içeriğini onaylamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Onay Notu (opsiyonel)',
        placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onayla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'İçerik başarıyla onaylandı.',
      'icerikOnayla'
    );
  }

  icerikReddet(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.icerikReddet(id, not),
      {
        title: 'İçerik Reddi',
        message: 'isimli dersin içeriğini reddetmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Red Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı red nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Reddet',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'İçerik reddedildi.',
      'icerikReddet'
    );
  }

  // --- Örnek Video İşlemleri ---

  ornekVideoIste(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.ornekVideoIste(id, not),
      {
        title: 'Örnek Video İste',
        message: 'isimli ders için eğitmenden örnek video istemek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Örnek Video İste',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Eğitmenden örnek video istendi.',
      'ornekVideoIste'
    );
  }

  ornekVideoGonder(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.ornekVideoGonder(id, not),
      {
        title: 'Örnek Video Gönder',
        message: 'isimli ders için örnek videoyu göndermek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Gönder',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Örnek video başarıyla gönderildi.',
      'ornekVideoGonder'
    );
  }

  ornekVideoOnayla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.ornekVideoOnayla(id, not),
      {
        title: 'Örnek Video Onayı',
        message: 'isimli dersin örnek videosunu onaylamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Onay Notu (opsiyonel)',
        placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onayla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Örnek video başarıyla onaylandı.',
      'ornekVideoOnayla'
    );
  }

  ornekVideoRevizeIste(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.ornekVideoRevizeIste(id, not),
      {
        title: 'Örnek Video Revize',
        message: 'isimli dersin örnek videosu için revize istemek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Revize Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı revize nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Revize İste',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Örnek video için revize istendi.',
      'ornekVideoRevizeIste'
    );
  }

  ornekVideoReddet(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.ornekVideoReddet(id, not),
      {
        title: 'Örnek Video Reddi',
        message: 'isimli dersin örnek videosunu reddetmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Red Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı red nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Reddet',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Örnek video reddedildi.',
      'ornekVideoReddet'
    );
  }

  // --- Ücret Bilgisi Girme ---

  ucretBilgisiGir(): void {
    if (!this.videoders?.id || this.submitting) return;

    const dialogData: UcretBilgisiDialogData = {
      entityName: this.videoders?.adi,
      odemeKaynakKodu: this.videoders?.odemeKaynak?.kodu || undefined,
      birimUcret: this.videoders?.birimUcret,
      toplamUcret: this.videoders?.toplamUcret
    };

    const ref = this.dialog.open<UcretBilgisiDialogResult | null>(UcretBilgisiDialogComponent, { data: dialogData });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.submitting = true;
        this.videodersService.ucretBilgisiGir(this.videoders!.id, {
          odemeKaynakKodu: result.odemeKaynakKodu,
          birimUcret: result.birimUcret,
          toplamUcret: result.toplamUcret,
          not: result.not
        })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (updated) => {
              this.videoders = updated;
              this.submitting = false;
              this.toastService.success('Ücret bilgisi başarıyla kaydedildi.');
            },
            error: (error) => {
              ErrorHandler.logError(error, 'ucretBilgisiGir');
              this.submitting = false;
              this.toastService.error(ErrorHandler.extractErrorMessage(error));
            }
          });
      }
    });
  }

  // --- İzlence İşlemleri ---

  izlenceEgitmeneGonder(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.izlenceEgitmeneGonder(id, not),
      {
        title: 'İzlence İçin Eğitmene Gönder',
        message: 'isimli ders için izlenceyi eğitmene göndermek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Eğitmene Gönder',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'İzlence eğitmene başarıyla gönderildi.',
      'izlenceEgitmeneGonder'
    );
  }

  izlenceOnayaSun(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.izlenceOnayaSun(id, not),
      {
        title: 'İzlenceyi Onaya Sun',
        message: 'isimli dersin izlencesini onaya sunmak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onaya Sun',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'İzlence başarıyla onaya sunuldu.',
      'izlenceOnayaSun'
    );
  }

  izlenceOnayla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.izlenceOnayla(id, not),
      {
        title: 'İzlence Onayı',
        message: 'isimli dersin izlencesini onaylamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Onay Notu (opsiyonel)',
        placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onayla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'İzlence başarıyla onaylandı.',
      'izlenceOnayla'
    );
  }

  izlenceyeRevizeIste(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.izlenceyeRevizeIste(id, not),
      {
        title: 'İzlenceye Revize İste',
        message: 'isimli dersin izlencesi için revize istemek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Revize Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı revize nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Revize İste',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'İzlence için revize istendi.',
      'izlenceyeRevizeIste'
    );
  }

  izlenceReddet(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.izlenceReddet(id, not),
      {
        title: 'İzlence Reddi',
        message: 'isimli dersin izlencesini reddetmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Red Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı red nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Reddet',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'İzlence reddedildi.',
      'izlenceReddet'
    );
  }

  // --- Sözleşme İşlemleri ---

  sozlesmeTalepEt(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.sozlesmeTalepEt(id, not),
      {
        title: 'Sözleşme Talep Et',
        message: 'isimli ders için sözleşme talep etmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Talep Et',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Sözleşme başarıyla talep edildi.',
      'sozlesmeTalepEt'
    );
  }

  sozlesmeReddet(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.sozlesmeReddet(id, not),
      {
        title: 'Sözleşme Reddi',
        message: 'isimli dersin sözleşmesini reddetmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Red Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı red nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Reddet',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Sözleşme reddedildi.',
      'sozlesmeReddet'
    );
  }

  // --- Çekim İşlemleri ---

  cekimTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.cekimTamamla(id, not),
      {
        title: 'Çekimi Tamamla',
        message: 'isimli dersin çekimini tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Çekim başarıyla tamamlandı.',
      'cekimTamamla'
    );
  }

  cekimOnOnayVer(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.cekimOnOnayVer(id, not),
      {
        title: 'Çekime Ön Onay',
        message: 'isimli dersin çekimine ön onay vermek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Onay Notu (opsiyonel)',
        placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
        confirmText: 'Ön Onay Ver',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Çekime ön onay verildi.',
      'cekimOnOnayVer'
    );
  }

  cekimRevizeIste(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.cekimRevizeIste(id, not),
      {
        title: 'Çekim Revize',
        message: 'isimli dersin çekimi için revize istemek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Revize Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı revize nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Revize İste',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Çekim için revize istendi.',
      'cekimRevizeIste'
    );
  }

  cekimReddet(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.cekimReddet(id, not),
      {
        title: 'Çekim Reddi',
        message: 'isimli dersin çekimini reddetmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Red Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı red nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Reddet',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Çekim reddedildi.',
      'cekimReddet'
    );
  }

  // --- Detaylı Kontrol İşlemleri ---

  detayliKontrolOnayla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.detayliKontrolOnayla(id, not),
      {
        title: 'Detaylı Kontrol Onayı',
        message: 'isimli dersin detaylı kontrolünü onaylamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Onay Notu (opsiyonel)',
        placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onayla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Detaylı kontrol başarıyla onaylandı.',
      'detayliKontrolOnayla'
    );
  }

  detayliRevizeIste(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.detayliRevizeIste(id, not),
      {
        title: 'Detaylı Revize',
        message: 'isimli ders için detaylı revize istemek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Revize Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı revize nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Revize İste',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Detaylı revize istendi.',
      'detayliRevizeIste'
    );
  }

  detayliRevizeyiTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.detayliRevizeyiTamamla(id, not),
      {
        title: 'Detaylı Revizeyi Tamamla',
        message: 'isimli dersin detaylı revizesini tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Detaylı revize başarıyla tamamlandı.',
      'detayliRevizeyiTamamla'
    );
  }

  // --- Soru Kontrol İşlemleri ---

  soruOnayla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.soruOnayla(id, not),
      {
        title: 'Soru Onayı',
        message: 'isimli dersin sorularını onaylamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Onay Notu (opsiyonel)',
        placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onayla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Sorular başarıyla onaylandı.',
      'soruOnayla'
    );
  }

  soruRevizeIste(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.soruRevizeIste(id, not),
      {
        title: 'Soru Revize',
        message: 'isimli dersin soruları için revize istemek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Revize Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı revize nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Revize İste',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Sorular için revize istendi.',
      'soruRevizeIste'
    );
  }

  soruRevizesiTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.soruRevizesiTamamla(id, not),
      {
        title: 'Soru Revizesini Tamamla',
        message: 'isimli dersin soru revizelerini tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Soru revizeleri başarıyla tamamlandı.',
      'soruRevizesiTamamla'
    );
  }

  // --- Post-Prodüksiyon İşlemleri ---

  montajTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.montajTamamla(id, not),
      {
        title: 'Montaj Tamamla',
        message: 'isimli dersin montajını tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Montaj başarıyla tamamlandı.',
      'montajTamamla'
    );
  }

  grafikTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.grafikTamamla(id, not),
      {
        title: 'Grafik Tamamla',
        message: 'isimli dersin grafiklerini tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Grafik başarıyla tamamlandı.',
      'grafikTamamla'
    );
  }

  tanitimVideosuTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.tanitimVideosuTamamla(id, not),
      {
        title: 'Tanıtım Videosu Tamamla',
        message: 'isimli dersin tanıtım videosunu tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Tanıtım videosu başarıyla tamamlandı.',
      'tanitimVideosuTamamla'
    );
  }

  altYaziTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.altYaziTamamla(id, not),
      {
        title: 'Alt Yazı Tamamla',
        message: 'isimli dersin alt yazılarını tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Alt yazı başarıyla tamamlandı.',
      'altYaziTamamla'
    );
  }

  storyboardTamamla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.storyboardTamamla(id, not),
      {
        title: 'Storyboard Tamamla',
        message: 'isimli dersin storyboard\'unu tamamlamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Tamamla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Storyboard başarıyla tamamlandı.',
      'storyboardTamamla'
    );
  }

  // --- Yayın İşlemleri ---

  lmsYukle(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.lmsYukle(id, not),
      {
        title: 'LMS\'e Yükle',
        message: 'isimli dersi LMS\'e yüklemek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'LMS\'e Yükle',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Ders başarıyla LMS\'e yüklendi.',
      'lmsYukle'
    );
  }

  yayinOncesiOnayaSun(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.yayinOncesiOnayaSun(id, not),
      {
        title: 'Yayın Öncesi Onaya Sun',
        message: 'isimli dersi yayın öncesi onaya sunmak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onaya Sun',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Ders yayın öncesi onaya sunuldu.',
      'yayinOncesiOnayaSun'
    );
  }

  yayinlamaOnayla(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.yayinlamaOnayla(id, not),
      {
        title: 'Yayınlama Onayı',
        message: 'isimli dersin yayınlanmasını onaylamak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Onay Notu (opsiyonel)',
        placeholder: 'İsteğe bağlı onay notunuzu buraya yazabilirsiniz...',
        confirmText: 'Onayla',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Yayınlama başarıyla onaylandı.',
      'yayinlamaOnayla'
    );
  }

  yayinlamayiReddet(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.yayinlamayiReddet(id, not),
      {
        title: 'Yayınlamayı Reddet',
        message: 'isimli dersin yayınlanmasını reddetmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Red Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı red nedeninizi buraya yazabilirsiniz...',
        confirmText: 'Reddet',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Yayınlama reddedildi.',
      'yayinlamayiReddet'
    );
  }

  yayinaAl(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.yayinaAl(id, not),
      {
        title: 'Yayına Al',
        message: 'isimli dersi yayına almak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Yayına Al',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Ders başarıyla yayına alındı.',
      'yayinaAl'
    );
  }

  sosyalMedyaDuyur(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.sosyalMedyaDuyur(id, not),
      {
        title: 'Sosyal Medyada Duyur',
        message: 'isimli dersi sosyal medyada duyurmak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Not (opsiyonel)',
        placeholder: 'İsteğe bağlı notunuzu buraya yazabilirsiniz...',
        confirmText: 'Duyur',
        cancelText: 'İptal',
        appearance: 'approve'
      },
      'Ders sosyal medyada duyuruldu.',
      'sosyalMedyaDuyur'
    );
  }

  yayindanKaldir(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.yayindanKaldir(id, not),
      {
        title: 'Yayından Kaldır',
        message: 'isimli dersi yayından kaldırmak istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'Kaldırma Nedeni (opsiyonel)',
        placeholder: 'İsteğe bağlı nedeninizi buraya yazabilirsiniz...',
        additionalInfo: 'Yayından kaldırılan ders artık portal üzerinden erişilemeyecektir.',
        confirmText: 'Yayından Kaldır',
        cancelText: 'İptal',
        appearance: 'reject'
      },
      'Ders yayından kaldırıldı.',
      'yayindanKaldir'
    );
  }

  // ==================== Materyal İşlemleri ====================

  private readonly MATERYAL_IZINLI_DURUMLAR: string[] = [
    DersDurumu.BASLATMA_ONAYI_VERILDI, DersDurumu.ICERIK_EGITMENE_GONDERILDI,
    DersDurumu.ICERIK_ONAYA_SUNULDU, DersDurumu.ICERIK_ONAYLANDI, DersDurumu.ICERIK_REDDEDILDI,
    DersDurumu.ORNEK_VIDEO_ISTENDI, DersDurumu.ORNEK_VIDEO_GONDERILDI,
    DersDurumu.ORNEK_VIDEO_ONAYLANDI, DersDurumu.ORNEK_VIDEO_REVIZE_ISTENDI, DersDurumu.ORNEK_VIDEO_REDDEDILDI,
    DersDurumu.IZLENCE_ICIN_EGITMENE_GONDERILDI, DersDurumu.IZLENCE_ONAYA_SUNULDU,
    DersDurumu.IZLENCE_ONAYLANDI, DersDurumu.IZLENCE_REDDEDILDI, DersDurumu.IZLENCE_REVIZE_ISTENDI,
    DersDurumu.SOZLESME_TALEP_EDILDI, DersDurumu.SOZLESME_IMZALANDI, DersDurumu.SOZLESME_REDDEDILDI,
    DersDurumu.CEKIM_TAMAMLANDI, DersDurumu.CEKIM_ON_ONAY_VERILDI,
    DersDurumu.CEKIM_REVIZE_ISTENDI, DersDurumu.CEKIM_REDDEDILDI,
    DersDurumu.DETAYLI_KONTROL_ONAYLANDI, DersDurumu.DETAYLI_KONTROL_REVIZE_ISTENDI, DersDurumu.DETAYLI_REVIZE_TAMAMLANDI,
    DersDurumu.SORU_KONTROL_ONAYLANDI, DersDurumu.SORU_KONTROL_REVIZE_ISTENDI, DersDurumu.SORU_REVIZE_TAMAMLANDI,
    DersDurumu.VIDEO_MONTAJI_TAMAMLANDI, DersDurumu.GRAFIK_TAMAMLANDI,
    DersDurumu.TANITIM_VIDEOSU_TAMAMLANDI, DersDurumu.ALT_YAZI_TAMAMLANDI, DersDurumu.STORYBOARD_TAMAMLANDI,
    DersDurumu.LMS_YUKLENDI, DersDurumu.YAYIN_ONCESI_ONAYA_SUNULDU,
    DersDurumu.YAYINLAMA_ONAYLANDI, DersDurumu.YAYINLAMA_REDDEDILDI
  ];

  canModifyMateryal(): boolean {
    if (!this.videoders?.dersDurumu?.kodu) return false;
    return this.MATERYAL_IZINLI_DURUMLAR.includes(this.videoders.dersDurumu.kodu);
  }

  private loadMateryaller(): void {
    if (!this.videoders?.id) return;
    this.materyalLoading.set(true);
    this.videodersMateryalService.getByDersId(this.videoders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.materyaller.set(data);
          this.materyalLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadMateryaller');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.materyalLoading.set(false);
        }
      });
  }

  onMateryalAddRequested(): void {
    if (!this.videoders?.id) return;
    this.materyalModalLoading.set(true);
    this.videodersMateryalService.getMedyaTurleri()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.availableMedyaTurleri.set(data);
          this.materyalModalLoading.set(false);
          setTimeout(() => this.materyalList?.openModal(), 0);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadMedyaTurleri');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.materyalModalLoading.set(false);
        }
      });
  }

  onMateryalUpload(event: { file: File; medyaTuruId: number }): void {
    if (!this.videoders?.id) return;
    this.materyalUploading.set(true);
    this.videodersMateryalService.uploadFile(event.file, this.videoders.id, event.medyaTuruId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Materyal başarıyla yüklendi.');
          this.loadMateryaller();
          this.materyalUploading.set(false);
          this.materyalList?.closeModal();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'uploadMateryal');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.materyalUploading.set(false);
        }
      });
  }

  onMateryalDelete(id: number): void {
    if (!id) return;
    this.materyalDeleting.set(true);
    this.videodersMateryalService.deleteFile(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Materyal başarıyla silindi.');
          this.loadMateryaller();
          this.materyalDeleting.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteMateryal');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.materyalDeleting.set(false);
        }
      });
  }

  onMateryalDownload(id: number): void {
    if (!id) return;
    this.videodersMateryalService.downloadFile(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const item = this.materyaller().find(m => m.id === id);
          const fileName = item?.dosyaAdi || 'dosya';
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'downloadMateryal');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  // --- İptal İşlemi ---

  /**
   * İptal Et butonunun görünürlüğünü belirler.
   * baslatmaOnayinaSun sonrası durumlardan YAYINA_ALINDI ve sonrası hariç.
   */
  iptalEdilebilirMi(): boolean {
    if (!this.videoders?.dersDurumu?.kodu) return false;
    const kodu = this.videoders.dersDurumu.kodu;
    const excludedStates: string[] = [
      DersDurumu.PLANLAMA, DersDurumu.ANLASMA, DersDurumu.CEKIM_DURUMU,
      DersDurumu.TESLIM, DersDurumu.ODEME_DURUMU, DersDurumu.TAMAMLANMA,
      DersDurumu.TASLAK_DERS,
      DersDurumu.IPTAL_EDILDI, DersDurumu.YAYINA_ALINDI,
      DersDurumu.SOSYAL_MEDYADA_DUYURULDU, DersDurumu.YAYINDAN_KALDIRILDI
    ];
    return !excludedStates.includes(kodu as DersDurumu);
  }

  iptalEt(): void {
    this.workflowIslemYap(
      (id, not) => this.videodersService.iptalEt(id, not),
      {
        title: 'Dersi İptal Et',
        message: 'isimli dersi iptal etmek istediğinizden emin misiniz?',
        entityName: this.videoders?.adi,
        noteLabel: 'İptal Nedeni',
        placeholder: 'İptal nedeninizi buraya yazınız...',
        additionalInfo: 'İptal edilen ders geri alınamaz.',
        confirmText: 'İptal Et',
        cancelText: 'Vazgeç',
        appearance: 'reject'
      },
      'Ders başarıyla iptal edildi.',
      'iptalEt'
    );
  }
}
