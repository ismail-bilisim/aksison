import { Component, OnInit, inject, DestroyRef, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgbNavChangeEvent, NgbNavModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DersDurumu } from '../../../../core/models/ders-durumu.enum';
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
import { KonuListComponent } from 'src/app/shared/components/konu-list/konu-list.component';
import { SoruListComponent } from 'src/app/shared/components/soru-list/soru-list.component';
import { SozlesmeListComponent } from 'src/app/shared/components/sozlesme-list/sozlesme-list.component';
import { EgitmenListComponent } from 'src/app/shared/components/egitmen-list/egitmen-list.component';
import { ProjeListComponent } from 'src/app/shared/components/proje-list/proje-list.component';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { ProjeOzet } from 'src/app/core/models/proje-ozet';
import { YuzyuzedersEgitmenService } from 'src/app/core/services/api/yuzyuzeders-egitmen.service';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { YuzyuzedersProjeService } from 'src/app/core/services/api/yuzyuzeders-proje.service';
import { ProjeService } from 'src/app/core/services/api/proje.service';
import { YuzyuzeDersBolumService } from 'src/app/core/services/api/yuzyuzeders-bolum.service';
import { BolumKonuService } from 'src/app/core/services/api/bolum-konu.service';
import { DersBolumResponse, DersBolumRequest, BolumKonuRequest } from 'src/app/core/models/ders-bolum';
import { SoruYuzyuzedersService } from 'src/app/core/services/api/soru-yuzyuzeders.service';
import { SoruVideoDersKonuResponse, SoruVideoDersKonuRequest } from 'src/app/core/models/soru-ders-konu';
import { SozlesmeYuzyuzeDersService } from 'src/app/core/services/api/sozlesme-yuzyuzeders.service';
import { SozlesmeDersResponse } from 'src/app/core/models/sozlesme-ders-response';
import { YuzyuzeDersBasvuruService } from 'src/app/core/services/api/yuzyuzeders-basvuru.service';
import { YuzyuzeDersBasvuruResponse } from 'src/app/core/models/yuzyuzeders-basvuru-response';
import { SozlesmeTemelComponent } from 'src/app/shared/components/sozlesme-temel/sozlesme-temel.component';
import { DegerlendirmeListComponent } from 'src/app/shared/components/degerlendirme-list/degerlendirme-list.component';
import { VideodersMateryalService } from 'src/app/core/services/api/videoders-materyal.service';
import { YuzyuzeDersDegerlendirmeService } from 'src/app/core/services/api/yuzyuzeders-degerlendirme.service';
import { YuzyuzeDersDegerlendirmeKriterService} from 'src/app/core/services/api/yuzyuzeders-degerlendirme-kriter.service';
import { DersDegerlendirmeResponse, DersDegerlendirmeRequest, DegerlendirmeKriterRequest, KriterOzet, DegerlendirmeTuruOzet } from 'src/app/core/models/degerlendirme';
import { MateryalListComponent } from 'src/app/shared/components/materyal-list/materyal-list.component';
import { MedyaTuruOzet } from 'src/app/core/models/medya-turu-ozet';
import { DersMateryalResponse } from 'src/app/core/models/ders-materyal-response';
import { YuzyuzeDersMateryalService } from 'src/app/core/services/api/yuzyuzeders-materyal.service';
import { UcretBilgisiDialogComponent, UcretBilgisiDialogData, UcretBilgisiDialogResult } from 'src/app/shared/components/ucret-bilgisi-dialog/ucret-bilgisi-dialog.component';

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
    IslemKayitListComponent,
    KonuListComponent,
    SoruListComponent,
    SozlesmeListComponent,
    EgitmenListComponent,
    ProjeListComponent,
    MateryalListComponent,
    DegerlendirmeListComponent
  ],
  templateUrl: './yuzyuzeders-detail-page.component.html',
  styleUrls: ['./yuzyuzeders-detail-page.component.css']
})
export class YuzyuzedersDetailPageComponent implements OnInit {
  @ViewChild('paydasList') paydasList?: PaydasListComponent;
  @ViewChild('kategoriList') kategoriList?: KategoriListComponent;
  @ViewChild('egitmenList') egitmenList?: EgitmenListComponent;
  @ViewChild('projeList') projeList?: ProjeListComponent;
  @ViewChild('materyalList') materyalList?: MateryalListComponent;

  yuzyuzeders?: YuzyuzeDersResponse;
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
  sorularLoaded = false;
  sozlesmelerLoaded = false;
  degerlendirmelerLoaded = false;
  basvurularLoaded = false;

  // Basvuru state
  basvurular = signal<YuzyuzeDersBasvuruResponse[]>([]);
  basvuruLoading = signal(false);

  // Bolum/Konu state
  bolumlar = signal<DersBolumResponse[]>([]);
  bolumLoading = signal(false);

  // Soru state
  sorular = signal<SoruVideoDersKonuResponse[]>([]);
  soruLoading = signal(false);

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
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly yuzyuzedersKategoriService = inject(YuzyuzedersKategoriService);
  private readonly kategoriService = inject(KategoriService);
  private readonly yuzyuzedersPaydasService = inject(YuzyuzedersPaydasService);
  private readonly paydasService = inject(PaydasService);
  private readonly yuzyuzedersMateryalService = inject(YuzyuzeDersMateryalService);

  private readonly yuzyuzedersIslemKayitService = inject(YuzyuzedersIslemKayitService);
  private readonly yuzyuzedersEgitmenService = inject(YuzyuzedersEgitmenService);
  private readonly egitmenService = inject(EgitmenService);
  private readonly yuzyuzedersProjeService = inject(YuzyuzedersProjeService);
  private readonly projeService = inject(ProjeService);
  private readonly dialog = inject(Dialog);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly yuzyuzeDersBolumService = inject(YuzyuzeDersBolumService);
  private readonly bolumKonuService = inject(BolumKonuService);
  private readonly soruYuzyuzeDersService = inject(SoruYuzyuzedersService);
  private readonly sozlesmeYuzyuzeDersService = inject(SozlesmeYuzyuzeDersService);
  private readonly yuzyuzeDersBasvuruService = inject(YuzyuzeDersBasvuruService);
  private readonly modalService = inject(NgbModal);
  private readonly yuzyuzeDersDegerlendirmeService = inject(YuzyuzeDersDegerlendirmeService);
  private readonly yuzyuzeDersKriterService = inject(YuzyuzeDersDegerlendirmeKriterService);

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
          // Konular is default tab, load bolumlar immediately
          this.loadBolumlar();
          this.konularLoaded = true;
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
      case 'konular':
        if (!this.konularLoaded) {
          this.loadBolumlar();
          this.konularLoaded = true;
        }
        break;
      case 'sorular':
        if (!this.sorularLoaded) {
          this.loadSorular();
          this.sorularLoaded = true;
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

  private loadEgitmenler(): void {
    if (!this.yuzyuzeders?.id) return;

    this.egitmenLoading.set(true);
    this.yuzyuzedersEgitmenService.getByDersId(this.yuzyuzeders.id)
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
    if (!this.yuzyuzeders?.id) return;
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
    if (!this.yuzyuzeders?.id || egitmenIds.length === 0) return;

    this.egitmenAssigning.set(true);
    const requests = egitmenIds.map(id => this.yuzyuzedersEgitmenService.addEgitmen(this.yuzyuzeders!.id, id));
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
    if (!this.yuzyuzeders?.id || !id) return;
    this.egitmenLoading.set(true);
    this.yuzyuzedersEgitmenService.deleteEgitmen(this.yuzyuzeders.id, id)
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
    if (!this.yuzyuzeders?.id) return;
    this.projeLoading.set(true);
    this.yuzyuzedersProjeService.getByDersId(this.yuzyuzeders.id)
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
    if (!this.yuzyuzeders?.id) return;
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
    if (!this.yuzyuzeders?.id || projeIds.length === 0) return;
    this.projeAdding.set(true);
    const requests = projeIds.map(id => this.yuzyuzedersProjeService.addProje(this.yuzyuzeders!.id, id));
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
    if (!this.yuzyuzeders?.id || !item.id) return;
    this.projeDeleting.set(true);
    this.yuzyuzedersProjeService.deleteProje(this.yuzyuzeders.id, item.id)
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

  // ========== BOLUM/KONU METHODS ==========

  private loadBolumlar(): void {
    if (!this.yuzyuzeders?.id) return;
    this.bolumLoading.set(true);
    this.yuzyuzeDersBolumService.getAllByDersIdOrdered(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          data.forEach(bolum => {
            this.bolumKonuService.getAllByBolumIdOrdered(bolum.bolum.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (konular) => {
                  bolum.bolum.bolumKonular = konular;
                }
              });
          });
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
    this.yuzyuzeDersBolumService.create(request)
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
    this.yuzyuzeDersBolumService.delete(dersBolumId)
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

  // ========== SORU METHODS ==========

  onSoruSaveRequested(request: SoruVideoDersKonuRequest): void {
    this.soruYuzyuzeDersService.createRelation(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Soru başarıyla eklendi');
          this.loadSorular();
          this.loadBolumlar();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'createSoru');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  private loadSorular(): void {
    if (!this.yuzyuzeders?.id) return;
    this.soruLoading.set(true);
    this.soruYuzyuzeDersService.getAllByDersId(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.sorular.set(data);
          this.soruLoading.set(false);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadSorular');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.soruLoading.set(false);
        }
      });
  }

  onSoruDelete(dersSoru: SoruVideoDersKonuResponse): void {
    this.soruYuzyuzeDersService.deleteDersSoru(dersSoru.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Soru başarıyla silindi.');
          this.loadSorular();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteSoru');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  onSoruNavigateDetail(soruId: number): void {
    this.router.navigate(['/soru/detail', soruId]);
  }

  onSoruNavigateEdit(soruId: number): void {
    this.router.navigate(['/soru/edit', soruId]);
  }

  // ========== SOZLESME METHODS ==========

  private loadSozlesmeler(): void {
    if (!this.yuzyuzeders?.id) return;
    this.sozlesmeLoading.set(true);
    this.sozlesmeYuzyuzeDersService.getAllByDersId(this.yuzyuzeders.id)
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
    modalRef.componentInstance.dersType = 'yuzyuzeders';
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
    if (!this.yuzyuzeders?.id) return;
    this.basvuruLoading.set(true);
    this.yuzyuzeDersBasvuruService.getAllByDersId(this.yuzyuzeders.id)
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
    const dersId = id || this.yuzyuzeders?.id;
    if (dersId) {
      this.router.navigate(['/yuzyuzeders/edit', dersId]);
    }
  }

  // ========== DEGERLENDIRME METHODS ==========

  canModifyDegerlendirme(): boolean {
    return true;
  }

  private loadDegerlendirmeler(): void {
    if (!this.yuzyuzeders?.id) return;
    this.degerlendirmeLoading.set(true);
    this.yuzyuzeDersDegerlendirmeService.getAllByDersId(this.yuzyuzeders.id)
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
    this.yuzyuzeDersDegerlendirmeService.create(request)
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
    if (!this.yuzyuzeders?.id) return;
    this.yuzyuzeDersDegerlendirmeService.delete(degerlendirmeId, this.yuzyuzeders.id)
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
    this.yuzyuzeDersKriterService.create(request)
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
    this.yuzyuzeDersKriterService.delete(event.kriterId, event.degerlendirmeId)
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
    this.yuzyuzeDersKriterService.getAllKriterler()
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
    this.yuzyuzeDersDegerlendirmeService.getAllTurler()
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

  baslatmaOnayinaSun(): void {
    if (!this.yuzyuzeders?.id) return;

    if (!confirm('Başlatmayı onaya sunmak istediğinize emin misiniz?')) {
      return;
    }

    this.submitting = true;
    this.yuzyuzedersService.baslatmaOnayinaSun(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Başlatma başarıyla onaya sunuldu.');
          this.loadYuzyuzeders(this.yuzyuzeders!.id);
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
    if (!this.yuzyuzeders?.id) return;

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
          this.yuzyuzedersService.baslatmaOnayla(this.yuzyuzeders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (updated) => {
                this.yuzyuzeders=updated;
                this.submitting = false;
                this.toastService.success('İçerik başarıyla onaylandı. Kodu: '+updated.kodu);
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
    if (!this.yuzyuzeders?.id) return;

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
          this.yuzyuzedersService.baslatmaReddet(this.yuzyuzeders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('İçerik reddedildi.');
                this.loadYuzyuzeders(this.yuzyuzeders!.id);
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
    serviceFn: (id: number, not?: string) => import('rxjs').Observable<YuzyuzeDersResponse>,
    successMessage: string
  ): void {
    if (!this.yuzyuzeders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: config,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined && result !== null) {
          this.submitting = true;
          serviceFn(this.yuzyuzeders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (updated) => {
                this.yuzyuzeders = updated;
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

  // ==================== CSV Workflow Methods (35 adet) ====================

  icerigiEgitmeneGonder(): void {
    this.workflowIslemYap(
      { title: 'İçeriği Eğitmene Gönder', message: 'İçeriği eğitmene göndermek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Gönder', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.icerigiEgitmeneGonder(id, not),
      'İçerik eğitmene gönderildi.'
    );
  }

  icerigiOnayaSun(): void {
    this.workflowIslemYap(
      { title: 'İçeriği Onaya Sun', message: 'İçeriği onaya sunmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Onaya Sun', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.icerigiOnayaSun(id, not),
      'İçerik onaya sunuldu.'
    );
  }

  icerikOnayla(): void {
    this.workflowIslemYap(
      { title: 'İçerik Onayla', message: 'İçeriği onaylamak istediğinize emin misiniz?', noteLabel: 'Onay Notu (İsteğe Bağlı)', confirmText: 'Onayla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.icerikOnayla(id, not),
      'İçerik onaylandı.'
    );
  }

  icerikReddet(): void {
    this.workflowIslemYap(
      { title: 'İçerik Reddet', message: 'İçeriği reddetmek istediğinize emin misiniz?', noteLabel: 'Red Nedeni (Zorunlu)', confirmText: 'Reddet', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.icerikReddet(id, not),
      'İçerik reddedildi.'
    );
  }

  izlenceIcinEgitmeneGonder(): void {
    this.workflowIslemYap(
      { title: 'İzlence İçin Eğitmene Gönder', message: 'İzlence için eğitmene göndermek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Gönder', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.izlenceIcinEgitmeneGonder(id, not),
      'İzlence için eğitmene gönderildi.'
    );
  }

  // --- Ücret Bilgisi Girme ---

  ucretBilgisiGir(): void {
    if (!this.yuzyuzeders?.id || this.submitting) return;

    const dialogData: UcretBilgisiDialogData = {
      entityName: this.yuzyuzeders?.adi,
      odemeKaynakKodu: this.yuzyuzeders?.odemeKaynak?.kodu || undefined,
      birimUcret: this.yuzyuzeders?.birimUcret,
      toplamUcret: this.yuzyuzeders?.toplamUcret
    };

    const ref = this.dialog.open<UcretBilgisiDialogResult | null>(UcretBilgisiDialogComponent, { data: dialogData });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.submitting = true;
        this.yuzyuzedersService.ucretBilgisiGir(this.yuzyuzeders!.id, {
          odemeKaynakKodu: result.odemeKaynakKodu,
          birimUcret: result.birimUcret,
          toplamUcret: result.toplamUcret,
          not: result.not
        })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (updated) => {
              this.yuzyuzeders = updated;
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

  izlenceyiOnayaSun(): void {
    this.workflowIslemYap(
      { title: 'İzlenceyi Onaya Sun', message: 'İzlenceyi onaya sunmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Onaya Sun', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.izlenceyiOnayaSun(id, not),
      'İzlence onaya sunuldu.'
    );
  }

  izlenceOnayla(): void {
    this.workflowIslemYap(
      { title: 'İzlence Onayla', message: 'İzlenceyi onaylamak istediğinize emin misiniz?', noteLabel: 'Onay Notu (İsteğe Bağlı)', confirmText: 'Onayla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.izlenceOnayla(id, not),
      'İzlence onaylandı.'
    );
  }

  izlenceReddet(): void {
    this.workflowIslemYap(
      { title: 'İzlence Reddet', message: 'İzlenceyi reddetmek istediğinize emin misiniz?', noteLabel: 'Red Nedeni (Zorunlu)', confirmText: 'Reddet', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.izlenceReddet(id, not),
      'İzlence reddedildi.'
    );
  }

  izlenceyeRevizeIste(): void {
    this.workflowIslemYap(
      { title: 'İzlenceye Revize İste', message: 'İzlence için revize istemek istediğinize emin misiniz?', noteLabel: 'Revize Notu (Zorunlu)', confirmText: 'Revize İste', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.izlenceyeRevizeIste(id, not),
      'İzlence için revize istendi.'
    );
  }

  egitmendenSunumIste(): void {
    this.workflowIslemYap(
      { title: 'Eğitmenden Sunum İste', message: 'Eğitmenden sunum istemek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Sunum İste', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.egitmendenSunumIste(id, not),
      'Eğitmenden sunum istendi.'
    );
  }

  sunumuOnayaSun(): void {
    this.workflowIslemYap(
      { title: 'Sunumu Onaya Sun', message: 'Sunumu onaya sunmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Onaya Sun', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.sunumuOnayaSun(id, not),
      'Sunum onaya sunuldu.'
    );
  }

  sunumuOnayla(): void {
    this.workflowIslemYap(
      { title: 'Sunumu Onayla', message: 'Sunumu onaylamak istediğinize emin misiniz?', noteLabel: 'Onay Notu (İsteğe Bağlı)', confirmText: 'Onayla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.sunumuOnayla(id, not),
      'Sunum onaylandı.'
    );
  }

  sunumuReddet(): void {
    this.workflowIslemYap(
      { title: 'Sunumu Reddet', message: 'Sunumu reddetmek istediğinize emin misiniz?', noteLabel: 'Red Nedeni (Zorunlu)', confirmText: 'Reddet', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.sunumuReddet(id, not),
      'Sunum reddedildi.'
    );
  }

  sunumaRevizeIste(): void {
    this.workflowIslemYap(
      { title: 'Sunuma Revize İste', message: 'Sunum için revize istemek istediğinize emin misiniz?', noteLabel: 'Revize Notu (Zorunlu)', confirmText: 'Revize İste', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.sunumaRevizeIste(id, not),
      'Sunum için revize istendi.'
    );
  }

  grafikTamamla(): void {
    this.workflowIslemYap(
      { title: 'Grafik Tamamla', message: 'Grafiği tamamlamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Tamamla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.grafikTamamla(id, not),
      'Grafik tamamlandı.'
    );
  }

  statikSayfaHazirla(): void {
    this.workflowIslemYap(
      { title: 'Statik Sayfa Hazırla', message: 'Statik sayfayı hazırlamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Hazırla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.statikSayfaHazirla(id, not),
      'Statik sayfa hazırlandı.'
    );
  }

  smDuyurusuYap(): void {
    this.workflowIslemYap(
      { title: 'SM Duyurusu Yap', message: 'SM duyurusunu yapmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Duyur', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.smDuyurusuYap(id, not),
      'SM duyurusu yapıldı.'
    );
  }

  basvuruListele(): void {
    this.workflowIslemYap(
      { title: 'Başvuru Listele', message: 'Başvuruları listelemek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Listele', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.basvuruListele(id, not),
      'Başvurular listelendi.'
    );
  }

  onKosulRaporla(): void {
    this.workflowIslemYap(
      { title: 'Ön Koşul Raporla', message: 'Ön koşulları raporlamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Raporla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.onKosulRaporla(id, not),
      'Ön koşullar raporlandı.'
    );
  }

  sinavAtamasi(): void {
    this.workflowIslemYap(
      { title: 'Sınav Ataması', message: 'Sınav ataması yapmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Ata', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.sinavAtamasi(id, not),
      'Sınav ataması yapıldı.'
    );
  }

  sinavMailiGonder(): void {
    this.workflowIslemYap(
      { title: 'Sınav Maili Gönder', message: 'Sınav mailini göndermek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Gönder', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.sinavMailiGonder(id, not),
      'Sınav maili gönderildi.'
    );
  }

  sinavRaporla(): void {
    this.workflowIslemYap(
      { title: 'Sınav Raporla', message: 'Sınavı raporlamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Raporla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.sinavRaporla(id, not),
      'Sınav raporlandı.'
    );
  }

  basvurulariDegerlendir(): void {
    this.workflowIslemYap(
      { title: 'Başvuruları Değerlendir', message: 'Başvuruları değerlendirmek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Değerlendir', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.basvurulariDegerlendir(id, not),
      'Başvurular değerlendirildi.'
    );
  }

  sozlesmeTalepEt(): void {
    this.workflowIslemYap(
      { title: 'Sözleşme Talep Et', message: 'Sözleşme talep etmek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Talep Et', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.sozlesmeTalepEt(id, not),
      'Sözleşme talep edildi.'
    );
  }

  sozlesmeyiReddet(): void {
    this.workflowIslemYap(
      { title: 'Sözleşmeyi Reddet', message: 'Sözleşmeyi reddetmek istediğinize emin misiniz?', noteLabel: 'Red Nedeni (Zorunlu)', confirmText: 'Reddet', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.sozlesmeyiReddet(id, not),
      'Sözleşme reddedildi.'
    );
  }

  kabulMailiGonder(): void {
    this.workflowIslemYap(
      { title: 'Kabul Maili Gönder', message: 'Kabul mailini göndermek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Gönder', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.kabulMailiGonder(id, not),
      'Kabul maili gönderildi.'
    );
  }

  wpGrubuOlustur(): void {
    this.workflowIslemYap(
      { title: 'WP Grubu Oluştur', message: 'WP grubunu oluşturmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Oluştur', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.wpGrubuOlustur(id, not),
      'WP grubu oluşturuldu.'
    );
  }

  yedeklereMailGonder(): void {
    this.workflowIslemYap(
      { title: 'Yedeklere Mail Gönder', message: 'Yedeklere mail göndermek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Gönder', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.yedeklereMailGonder(id, not),
      'Yedeklere mail gönderildi.'
    );
  }

  wpGrubunuTamamla(): void {
    this.workflowIslemYap(
      { title: 'WP Grubunu Tamamla', message: 'WP grubunu tamamlamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Tamamla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.wpGrubunuTamamla(id, not),
      'WP grubu tamamlandı.'
    );
  }

  redMailiGonder(): void {
    this.workflowIslemYap(
      { title: 'Red Maili Gönder', message: 'Red mailini göndermek istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Gönder', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.redMailiGonder(id, not),
      'Red maili gönderildi.'
    );
  }

  dersiBaslat(): void {
    this.workflowIslemYap(
      { title: 'Dersi Başlat', message: 'Dersi başlatmak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Başlat', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.dersiBaslat(id, not),
      'Ders başlatıldı.'
    );
  }

  yoklamayiTamamla(): void {
    this.workflowIslemYap(
      { title: 'Yoklamayı Tamamla', message: 'Yoklamayı tamamlamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Tamamla', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.yoklamayiTamamla(id, not),
      'Yoklama tamamlandı.'
    );
  }

  anketAta(): void {
    this.workflowIslemYap(
      { title: 'Anket Ata', message: 'Anket atamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Ata', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.anketAta(id, not),
      'Anket atandı.'
    );
  }

  sertifikaAta(): void {
    this.workflowIslemYap(
      { title: 'Sertifika Ata', message: 'Sertifika atamak istediğinize emin misiniz?', noteLabel: 'Not (İsteğe Bağlı)', confirmText: 'Ata', appearance: 'approve' },
      (id, not) => this.yuzyuzedersService.sertifikaAta(id, not),
      'Sertifika atandı.'
    );
  }

  iptalEt(): void {
    this.workflowIslemYap(
      { title: 'İptal Et', message: 'Dersi iptal etmek istediğinize emin misiniz?', noteLabel: 'İptal Nedeni (Zorunlu)', confirmText: 'İptal Et', appearance: 'reject' },
      (id, not) => this.yuzyuzedersService.iptalEt(id, not),
      'Ders iptal edildi.'
    );
  }


  // ==================== Materyal İşlemleri ====================

  private readonly MATERYAL_IZINLI_DURUMLAR: string[] = [
    DersDurumu.BASLATMA_ONAYI_VERILDI, DersDurumu.ICERIK_EGITMENE_GONDERILDI,
    DersDurumu.ICERIK_ONAYA_SUNULDU, DersDurumu.ICERIK_ONAYLANDI, DersDurumu.ICERIK_REDDEDILDI,
    DersDurumu.EGITMENDEN_SUNUM_ISTENDI, DersDurumu.ORNEK_VIDEO_GONDERILDI,
    DersDurumu.ORNEK_VIDEO_ONAYLANDI, DersDurumu.SUNUMA_REVIZE_ISTENDI, DersDurumu.SUNUM_REDDEDILDI,
    DersDurumu.IZLENCE_ICIN_EGITMENE_GONDERILDI, DersDurumu.IZLENCE_ONAYA_SUNULDU,
    DersDurumu.IZLENCE_ONAYLANDI, DersDurumu.IZLENCE_REDDEDILDI, DersDurumu.IZLENCE_REVIZE_ISTENDI,
    DersDurumu.SOZLESME_TALEP_EDILDI, DersDurumu.SOZLESME_IMZALANDI, DersDurumu.SOZLESME_REDDEDILDI,
    DersDurumu.SORU_KONTROL_ONAYLANDI, DersDurumu.SORU_KONTROL_REVIZE_ISTENDI, DersDurumu.SORU_REVIZE_TAMAMLANDI,
  ];

  canModifyMateryal(): boolean {
    if (!this.yuzyuzeders?.dersDurumu?.kodu) return false;
    return this.MATERYAL_IZINLI_DURUMLAR.includes(this.yuzyuzeders.dersDurumu.kodu);
  }

  private loadMateryaller(): void {
    if (!this.yuzyuzeders?.id) return;
    this.materyalLoading.set(true);
    this.yuzyuzedersMateryalService.getByDersId(this.yuzyuzeders.id)
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
    if (!this.yuzyuzeders?.id) return;
    this.materyalModalLoading.set(true);
    this.yuzyuzedersMateryalService.getMedyaTurleri()
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
    if (!this.yuzyuzeders?.id) return;
    this.materyalUploading.set(true);
    this.yuzyuzedersMateryalService.uploadFile(event.file, this.yuzyuzeders.id, event.medyaTuruId)
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
    this.yuzyuzedersMateryalService.deleteFile(id)
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
    this.yuzyuzedersMateryalService.downloadFile(id)
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
