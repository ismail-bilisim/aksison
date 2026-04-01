import { Component, OnInit, inject, DestroyRef, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgbNavChangeEvent, NgbNavModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DersDurumu } from '../../../../core/models/ders-durumu.enum';
import { CanliDersResponse } from '../../../../core/models/canliders-response';
import { CanlidersService } from '../../../../core/services/api/canliders.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { CanlidersTemelComponent } from '../../components/canliders-temel/canliders-temel.component';
import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';
import { KategoriListComponent } from 'src/app/shared/components/kategori-list/kategori-list.component';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { CanlidersKategoriService } from 'src/app/core/services/api/canliders-kategori.service';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { Kategori } from 'src/app/core/models/kategori';
import { PaydasListComponent } from 'src/app/shared/components/paydas-list/paydas-list.component';
import { CanlidersPaydasService } from 'src/app/core/services/api/canliders-paydas.service';
import { PaydasService } from 'src/app/core/services/api/paydas.service';
import { PaydasOzet } from 'src/app/core/models/paydas-ozet';
import { IslemKayitListComponent } from 'src/app/shared/components/islem-kayit-list/islem-kayit-list.component';
import { CanlidersIslemKayitService } from 'src/app/core/services/api/canliders-islem-kayit.service';
import { IslemKayit } from 'src/app/core/models/islem-kayit';
import { KonuListComponent } from 'src/app/shared/components/konu-list/konu-list.component';
import { SozlesmeListComponent } from 'src/app/shared/components/sozlesme-list/sozlesme-list.component';
import { EgitmenListComponent } from 'src/app/shared/components/egitmen-list/egitmen-list.component';
import { ProjeListComponent } from 'src/app/shared/components/proje-list/proje-list.component';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { ProjeOzet } from 'src/app/core/models/proje-ozet';
import { CanlidersEgitmenService } from 'src/app/core/services/api/canliders-egitmen.service';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { CanlidersProjeService } from 'src/app/core/services/api/canliders-proje.service';
import { ProjeService } from 'src/app/core/services/api/proje.service';
import { CanliDersBolumService } from 'src/app/core/services/api/canliders-bolum.service';
import { BolumKonuService } from 'src/app/core/services/api/bolum-konu.service';
import { DersBolumResponse, DersBolumRequest, BolumKonuRequest } from 'src/app/core/models/ders-bolum';
import { SozlesmeCanliDersService } from 'src/app/core/services/api/sozlesme-canliders.service';
import { SozlesmeDersResponse } from 'src/app/core/models/sozlesme-ders-response';
import { CanliDersBasvuruService } from 'src/app/core/services/api/canliders-basvuru.service';
import { CanliDersBasvuruResponse } from 'src/app/core/models/canliders-basvuru-response';
import { SozlesmeTemelComponent } from 'src/app/shared/components/sozlesme-temel/sozlesme-temel.component';
import { DegerlendirmeListComponent } from 'src/app/shared/components/degerlendirme-list/degerlendirme-list.component';
import { CanliDersDegerlendirmeService } from 'src/app/core/services/api/canliders-degerlendirme.service';
import { CanliDersDegerlendirmeKriterService } from 'src/app/core/services/api/canliders-degerlendirme-kriter.service';
import { DersDegerlendirmeResponse, DersDegerlendirmeRequest, DegerlendirmeKriterRequest, KriterOzet, DegerlendirmeTuruOzet } from 'src/app/core/models/degerlendirme';
import { MateryalListComponent } from 'src/app/shared/components/materyal-list/materyal-list.component';
import { MedyaTuruOzet } from 'src/app/core/models/medya-turu-ozet';
import { DersMateryalResponse } from 'src/app/core/models/ders-materyal-response';
import { CanliDersMateryalService } from 'src/app/core/services/api/canliders-materyal.service';
import { UcretBilgisiDialogComponent, UcretBilgisiDialogData, UcretBilgisiDialogResult } from 'src/app/shared/components/ucret-bilgisi-dialog/ucret-bilgisi-dialog.component';
import { SoruVideoDersKonuRequest } from 'src/app/core/models/soru-ders-konu';

@Component({
  selector: 'app-canliders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    NgbNavModule,
    CanlidersTemelComponent,
    KategoriListComponent,
    PaydasListComponent,
    IslemKayitListComponent,
    KonuListComponent,
    SozlesmeListComponent,
    EgitmenListComponent,
    ProjeListComponent,
    MateryalListComponent,
    DegerlendirmeListComponent
  ],
  templateUrl: './canliders-detail-page.component.html',
  styleUrls: ['./canliders-detail-page.component.css']
})
export class CanlidersDetailPageComponent implements OnInit {
  @ViewChild('paydasList') paydasList?: PaydasListComponent;
  @ViewChild('kategoriList') kategoriList?: KategoriListComponent;
  @ViewChild('egitmenList') egitmenList?: EgitmenListComponent;
  @ViewChild('projeList') projeList?: ProjeListComponent;
  @ViewChild('materyalList') materyalList?: MateryalListComponent;

  canliders?: CanliDersResponse;
  loading = false;
  activeTab = 'konular';
  submitting = false;
  
  readonly DersDurumu = DersDurumu;

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

  materyaller = signal<DersMateryalResponse[]>([]);
  materyalLoading = signal(false);
  materyalDeleting = signal(false);
  materyalUploading = signal(false);
  materyalModalLoading = signal(false);
  availableMedyaTurleri = signal<MedyaTuruOzet[]>([]);
  materyalLoaded = false;

  islemKayitlar = signal<IslemKayit[]>([]);
  islemKayitLoading = signal(false);
  islemlerLoaded = false;

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

  konularLoaded = false;
  sozlesmelerLoaded = false;
  degerlendirmelerLoaded = false;
  basvurularLoaded = false;

  // Basvuru state
  basvurular = signal<CanliDersBasvuruResponse[]>([]);
  basvuruLoading = signal(false);

  // Bolum/Konu state
  bolumlar = signal<DersBolumResponse[]>([]);
  bolumLoading = signal(false);

  // Sozlesme state
  sozlesmeler = signal<SozlesmeDersResponse[]>([]);
  sozlesmeLoading = signal(false);

  // Degerlendirme state
  degerlendirmeler = signal<DersDegerlendirmeResponse[]>([]);
  degerlendirmeLoading = signal(false);
  availableKriterler = signal<KriterOzet[]>([]);
  availableTurler = signal<DegerlendirmeTuruOzet[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly canlidersService = inject(CanlidersService);
  private readonly canlidersKategoriService = inject(CanlidersKategoriService);
  private readonly kategoriService = inject(KategoriService);
  private readonly canlidersPaydasService = inject(CanlidersPaydasService);
  private readonly paydasService = inject(PaydasService);
  private readonly canlidersMateryalService = inject(CanliDersMateryalService);
  private readonly canlidersIslemKayitService = inject(CanlidersIslemKayitService);
  private readonly canlidersEgitmenService = inject(CanlidersEgitmenService);
  private readonly egitmenService = inject(EgitmenService);
  private readonly canlidersProjeService = inject(CanlidersProjeService);
  private readonly projeService = inject(ProjeService);
  private readonly dialog = inject(Dialog);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canliDersBolumService = inject(CanliDersBolumService);
  private readonly bolumKonuService = inject(BolumKonuService);
  private readonly sozlesmeCanliDersService = inject(SozlesmeCanliDersService);
  private readonly canliDersBasvuruService = inject(CanliDersBasvuruService);
  private readonly modalService = inject(NgbModal);
  private readonly canliDersDegerlendirmeService = inject(CanliDersDegerlendirmeService);
  private readonly canliDersKriterService = inject(CanliDersDegerlendirmeKriterService);

  onayNotu: string = '';
  redNedeni: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadCanliders(+id);
    }
  }

  loadCanliders(id: number): void {
    this.loading = true;
    this.canliders = undefined;

    this.canlidersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.canliders = data;
          this.loading = false;
          this.loadBolumlar();
          this.konularLoaded = true;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadCanliders');
          this.loading = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onTabChange(event: NgbNavChangeEvent): void {
    switch (event.nextId) {
      case 'konular':
        if (!this.konularLoaded) {
          this.loadBolumlar();
          this.konularLoaded = true;
        }
        break;
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
      case 'materyaller':
        if (!this.materyalLoaded) {
          this.loadMateryaller();
          this.materyalLoaded = true;
        }
        break;
      case 'egitmenler':
        if (!this.egitmenLoaded) {
          this.loadEgitmenler();
          this.egitmenLoaded = true;
        }
        break;
      case 'projeler':
        if (!this.projelerLoaded) {
          this.loadProjeler();
          this.projelerLoaded = true;
        }
        break;
      case 'sozlesmeler':
        if (!this.sozlesmelerLoaded) {
          this.loadSozlesmeler();
          this.sozlesmelerLoaded = true;
        }
        break;
      case 'degerlendirmeler':
        if (!this.degerlendirmelerLoaded) {
          this.loadDegerlendirmeler();
          this.degerlendirmelerLoaded = true;
        }
        break;
      case 'islemler':
        if (!this.islemlerLoaded) {
          this.loadIslemKayitlar();
          this.islemlerLoaded = true;
        }
        break;
      case 'basvurular':
        if (!this.basvurularLoaded) {
          this.loadBasvurular();
          this.basvurularLoaded = true;
        }
        break;
      default:
        break;
    }
  }

  // ========== KATEGORI METHODS ==========

  private loadKategoriler(): void {
    if (!this.canliders?.id) return;
    this.kategoriLoading.set(true);
    this.canlidersKategoriService.getKategoriOzetByDersId(this.canliders.id)
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
    if (!this.canliders?.id) return;
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
    if (!this.canliders?.id || kategoriIds.length === 0) return;
    this.kategoriAdding.set(true);
    const requests = kategoriIds.map(kategoriId => this.canlidersKategoriService.addKategori(this.canliders!.id, kategoriId));

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
    if (!this.canliders?.id) return;
    this.kategoriDeleting.set(true);
    this.canlidersKategoriService.deleteKategori(this.canliders.id, kategoriId)
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

  // ========== PAYDAS METHODS ==========

  private loadPaydaslar(): void {
    if (!this.canliders?.id) return;
    this.paydasLoading.set(true);
    this.canlidersPaydasService.getByDersId(this.canliders.id)
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
    if (!this.canliders?.id) return;
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
    if (!this.canliders?.id || paydasIds.length === 0) return;
    this.paydasAdding.set(true);
    const requests = paydasIds.map(id => this.canlidersPaydasService.addPaydas(this.canliders!.id, id));

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
    if (!this.canliders?.id || !item.id) return;
    this.paydasDeleting.set(true);
    this.canlidersPaydasService.deletePaydas(this.canliders.id, item.id)
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

  // ========== EGITMEN METHODS ==========

  private loadEgitmenler(): void {
    if (!this.canliders?.id) return;
    this.egitmenLoading.set(true);
    this.canlidersEgitmenService.getByDersId(this.canliders.id)
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
    if (!this.canliders?.id) return;
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
    if (!this.canliders?.id || egitmenIds.length === 0) return;
    this.egitmenAssigning.set(true);
    const requests = egitmenIds.map(id => this.canlidersEgitmenService.addEgitmen(this.canliders!.id, id));
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
    if (!this.canliders?.id || !id) return;
    this.egitmenLoading.set(true);
    this.canlidersEgitmenService.deleteEgitmen(this.canliders.id, id)
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

  // ========== PROJE METHODS ==========

  private loadProjeler(): void {
    if (!this.canliders?.id) return;
    this.projeLoading.set(true);
    this.canlidersProjeService.getByDersId(this.canliders.id)
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
    if (!this.canliders?.id) return;
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
    if (!this.canliders?.id || projeIds.length === 0) return;
    this.projeAdding.set(true);
    const requests = projeIds.map(id => this.canlidersProjeService.addProje(this.canliders!.id, id));
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
    if (!this.canliders?.id || !item.id) return;
    this.projeDeleting.set(true);
    this.canlidersProjeService.deleteProje(this.canliders.id, item.id)
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

  // ========== ISLEM KAYIT METHODS ==========

  private loadIslemKayitlar(): void {
    if (!this.canliders?.id) return;
    this.islemKayitLoading.set(true);
    this.canlidersIslemKayitService.getByDersId(this.canliders.id)
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

  // ========== BOLUM/KONU METHODS ==========

  private loadBolumlar(): void {
    if (!this.canliders?.id) return;
    this.bolumLoading.set(true);
    this.canliDersBolumService.getAllByDersIdOrdered(this.canliders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const bolumIds = data.map(b => b.bolum.id);
          if (bolumIds.length > 0) {
            this.bolumKonuService.getAllByBolumIdsOrdered(bolumIds)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (konularMap) => {
                  data.forEach(bolum => {
                    bolum.bolum.bolumKonular = konularMap[bolum.bolum.id] || [];
                  });
                  this.bolumlar.set([...data]);
                }
              });
          }
          this.bolumlar.set(data);
          this.bolumLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadBolumlar');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.bolumLoading.set(false);
        }
      });
  }

  onBolumAdd(request: DersBolumRequest): void {
    this.canliDersBolumService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Bölüm başarıyla eklendi.');
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addBolum');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onBolumDelete(dersBolumId: number): void {
    this.canliDersBolumService.delete(dersBolumId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Bölüm başarıyla silindi.');
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteBolum');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onKonuAdd(request: BolumKonuRequest): void {
    this.bolumKonuService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Konu başarıyla eklendi.');
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addKonu');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onKonuDelete(bolumKonuId: number): void {
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
        }
      });
  }

  onSoruSaveRequested(request: SoruVideoDersKonuRequest): void {
    // CanlıDers does not have Soru tab, but konu-list may emit this
    // No-op for CanlıDers
  }

  // ========== SOZLESME METHODS ==========

  private loadSozlesmeler(): void {
    if (!this.canliders?.id) return;
    this.sozlesmeLoading.set(true);
    this.sozlesmeCanliDersService.getAllByDersId(this.canliders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.sozlesmeler.set(data);
          this.sozlesmeLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadSozlesmeler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.sozlesmeLoading.set(false);
        }
      });
  }

  onSozlesmeSelect(sozlesme: SozlesmeDersResponse): void {
    const modalRef = this.modalService.open(SozlesmeTemelComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.sozlesme = sozlesme;
    modalRef.componentInstance.dersType = 'canliders';
    modalRef.result.then(
      (result) => {
        if (result === 'imzalandi') {
          this.loadSozlesmeler();
          this.toastService.success('Sözleşme başarıyla imzalandı.');
        }
      },
      () => {} // dismissed
    );
  }

  onSozlesmeCreated(): void {
    this.loadSozlesmeler();
  }

  // ========== BASVURU METHODS ==========

  private loadBasvurular(): void {
    if (!this.canliders?.id) return;
    this.basvuruLoading.set(true);
    this.canliDersBasvuruService.getAllByDersId(this.canliders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.basvurular.set(data);
          this.basvuruLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadBasvurular');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.basvuruLoading.set(false);
        }
      });
  }

  onEdit(id?: number): void {
    const dersId = id || this.canliders?.id;
    if (dersId) {
      this.router.navigate(['/canliders/edit', dersId]);
    }
  }

  // ========== DEGERLENDIRME METHODS ==========

  canModifyDegerlendirme(): boolean {
    return true;
  }

  private loadDegerlendirmeler(): void {
    if (!this.canliders?.id) return;
    this.degerlendirmeLoading.set(true);
    this.canliDersDegerlendirmeService.getAllByDersId(this.canliders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.degerlendirmeler.set(data);
          this.degerlendirmeLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadDegerlendirmeler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.degerlendirmeLoading.set(false);
        }
      });
  }

  onDegerlendirmeAdd(request: DersDegerlendirmeRequest): void {
    this.canliDersDegerlendirmeService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Değerlendirme başarıyla eklendi.');
          this.loadDegerlendirmeler();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addDegerlendirme');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onDegerlendirmeDelete(degerlendirmeId: number): void {
    if (!this.canliders?.id) return;
    this.canliDersDegerlendirmeService.delete(degerlendirmeId, this.canliders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Değerlendirme başarıyla silindi.');
          this.loadDegerlendirmeler();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteDegerlendirme');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onKriterAdd(request: DegerlendirmeKriterRequest): void {
    this.canliDersKriterService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Kriter başarıyla eklendi.');
          this.loadDegerlendirmeler();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'addKriter');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onKriterDelete(event: { kriterId: number; degerlendirmeId: number }): void {
    this.canliDersKriterService.delete(event.kriterId, event.degerlendirmeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Kriter başarıyla silindi.');
          this.loadDegerlendirmeler();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteKriter');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onKriterLoadRequested(): void {
    this.canliDersKriterService.getAllKriterler()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.availableKriterler.set(data);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadKriterler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onTuruLoadRequested(): void {
    this.canliDersDegerlendirmeService.getAllTurler()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.availableTurler.set(data);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadTurler');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  // ==================== Workflow Methods ====================

  baslatmaOnayinaSun(): void {
    if (!this.canliders?.id) return;

    if (!confirm('Başlatmayı onaya sunmak istediğinize emin misiniz?')) {
      return;
    }

    this.submitting = true;
    this.canlidersService.baslatmaOnayinaSun(this.canliders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Başlatma başarıyla onaya sunuldu.');
          this.loadCanliders(this.canliders!.id);
          this.submitting = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'baslatmaOnayinaSun');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.submitting = false;
        }
      });
  }

  baslatmaOnayla(): void {
    if (!this.canliders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: {
        title: 'Başlatma Onay',
        message: 'Başlatmayı Onaylamak istediğinize emin misiniz?',
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
          this.canlidersService.baslatmaOnayla(this.canliders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (updated) => {
                this.canliders = updated;
                this.submitting = false;
                this.toastService.success('Başlatma başarıyla onaylandı. Kodu: ' + updated.kodu);
              },
              error: (error) => {
                ErrorHandler.logError(error, 'baslatmaOnayla');
                this.toastService.error(ErrorHandler.extractErrorMessage(error));
                this.submitting = false;
              }
            });
        }
      });
  }

  baslatmaReddet(): void {
    if (!this.canliders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: {
        title: 'Başlatma Red',
        message: 'Başlatmayı reddetmek istediğinize emin misiniz?',
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
          this.canlidersService.baslatmaReddet(this.canliders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('Başlatma reddedildi.');
                this.loadCanliders(this.canliders!.id);
                this.submitting = false;
              },
              error: (error) => {
                ErrorHandler.logError(error, 'baslatmaReddet');
                this.toastService.error(ErrorHandler.extractErrorMessage(error));
                this.submitting = false;
              }
            });
        }
      });
  }

  // ==================== Generic Workflow Helper ====================

  private workflowIslemYap(
    config: ApprovalDialogData,
    serviceFn: (id: number, not?: string) => import('rxjs').Observable<CanliDersResponse>,
    successMessage: string
  ): void {
    if (!this.canliders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: config,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined && result !== null) {
          this.submitting = true;
          serviceFn(this.canliders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (updated) => {
                this.canliders = updated;
                this.submitting = false;
                this.toastService.success(successMessage);
              },
              error: (error) => {
                ErrorHandler.logError(error, 'workflowIslemYap');
                this.toastService.error(ErrorHandler.extractErrorMessage(error));
                this.submitting = false;
              }
            });
        }
      });
  }

  // ==================== CanlıDers Workflow Methods ====================

  icerigiEgitmeneGonder(): void {
    this.workflowIslemYap(
      { title: 'İçeriği Eğitmene Gönder', message: 'İçeriği eğitmene göndermek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Gönder', appearance: 'approve' },
      (id, not) => this.canlidersService.icerigiEgitmeneGonder(id, not),
      'İçerik eğitmene gönderildi.'
    );
  }

  icerigiOnayaSun(): void {
    this.workflowIslemYap(
      { title: 'İçeriği Onaya Sun', message: 'İçeriği onaya sunmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Onaya Sun', appearance: 'approve' },
      (id, not) => this.canlidersService.icerigiOnayaSun(id, not),
      'İçerik onaya sunuldu.'
    );
  }

  icerikOnayla(): void {
    this.workflowIslemYap(
      { title: 'İçerik Onayla', message: 'İçeriği onaylamak istediğinize emin misiniz?', noteLabel: 'Onay Notu (İsteğe Bağlı)', confirmText: 'Onayla', appearance: 'approve' },
      (id, not) => this.canlidersService.icerikOnayla(id, not),
      'İçerik onaylandı.'
    );
  }

  icerikReddet(): void {
    this.workflowIslemYap(
      { title: 'İçerik Reddet', message: 'İçeriği reddetmek istediğinize emin misiniz?', noteLabel: 'Red Nedeni (Zorunlu)', confirmText: 'Reddet', appearance: 'reject' },
      (id, not) => this.canlidersService.icerikReddet(id, not),
      'İçerik reddedildi.'
    );
  }

  ucretBilgisiGir(): void {
    if (!this.canliders?.id || this.submitting) return;

    const dialogData: UcretBilgisiDialogData = {
      entityName: this.canliders?.adi,
      odemeKaynakKodu: this.canliders?.odemeKaynak?.kodu || undefined,
      birimUcret: this.canliders?.birimUcret,
      toplamUcret: this.canliders?.toplamUcret
    };

    const ref = this.dialog.open<UcretBilgisiDialogResult | null>(UcretBilgisiDialogComponent, { data: dialogData });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.submitting = true;
        this.canlidersService.ucretBilgisiGir(this.canliders!.id, {
          odemeKaynakKodu: result.odemeKaynakKodu,
          birimUcret: result.birimUcret,
          toplamUcret: result.toplamUcret,
          not: result.not
        })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (updated) => {
              this.canliders = updated;
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

  sozlesmeTalepEt(): void {
    this.workflowIslemYap(
      { title: 'Sözleşme Talep Et', message: 'Sözleşme talep etmek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Talep Et', appearance: 'approve' },
      (id, not) => this.canlidersService.sozlesmeTalepEt(id, not),
      'Sözleşme talep edildi.'
    );
  }

  iptalEt(): void {
    this.workflowIslemYap(
      { title: 'İptal Et', message: 'Dersi iptal etmek istediğinize emin misiniz?', noteLabel: 'İptal Nedeni (Zorunlu)', confirmText: 'İptal Et', appearance: 'reject' },
      (id, not) => this.canlidersService.iptalEt(id, not),
      'Ders iptal edildi.'
    );
  }

  // ==================== Materyal İşlemleri ====================

  private readonly MATERYAL_IZINLI_DURUMLAR: string[] = [
    DersDurumu.BASLATMA_ONAYI_VERILDI, DersDurumu.ICERIK_EGITMENE_GONDERILDI,
    DersDurumu.ICERIK_ONAYA_SUNULDU, DersDurumu.ICERIK_ONAYLANDI, DersDurumu.ICERIK_REDDEDILDI,
    DersDurumu.SOZLESME_TALEP_EDILDI
  ];

  canModifyMateryal(): boolean {
    if (!this.canliders?.dersDurumu?.kodu) return false;
    return this.MATERYAL_IZINLI_DURUMLAR.includes(this.canliders.dersDurumu.kodu);
  }

  private loadMateryaller(): void {
    if (!this.canliders?.id) return;
    this.materyalLoading.set(true);
    this.canlidersMateryalService.getByDersId(this.canliders.id)
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
    if (!this.canliders?.id) return;
    this.materyalModalLoading.set(true);
    this.canlidersMateryalService.getMedyaTurleri()
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
    if (!this.canliders?.id) return;
    this.materyalUploading.set(true);
    this.canlidersMateryalService.uploadFile(event.file, this.canliders.id, event.medyaTuruId)
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
    this.canlidersMateryalService.deleteFile(id)
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
    this.canlidersMateryalService.downloadFile(id)
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
}
