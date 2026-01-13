import { Component, OnInit, inject, ViewChild, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VideoDersResponse} from '../../../../core/models/videoders-response';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { VideodersKategoriService } from '../../../../core/services/api/videoders-kategori.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { KategoriOzet } from '../../../../core/models/kategori-ozet';
import { VideodersTemelComponent } from '../../components/videoders-temel/videoders-temel.component';
import { VideodersKonuListComponent } from '../../components/videoders-konu-list/videoders-konu-list.component';
import { VideodersSorumlularComponent } from '../../components/videoders-sorumlular/videoders-sorumlular.component';
import { VideodersUcretComponent } from '../../components/videoders-ucret/videoders-ucret.component';
import { VideodersOnkosulListComponent } from '../../components/videoders-onkosul-list/videoders-onkosul-list.component';
import { KategoriListComponent } from 'src/app/shared/components/kategori-list/kategori-list.component';
import { VideodersProjeListComponent } from '../../components/videoders-proje-list/videoders-proje-list.component';
import { VideodersPaydasListComponent } from '../../components/videoders-paydas-list/videoders-paydas-list.component';
import { VideodersSozlesmeListComponent } from '../../components/videoders-sozlesme-list/videoders-sozlesme-list.component';
import { VideodersIslemKayitListComponent } from '../../components/videoders-islem-kayit-list/videoders-islem-kayit-list.component';
import { VideodersOzetComponent } from '../../components/videoders-ozet/videoders-ozet.component';
import { VideodersSoruListComponent } from '../../components/videoders-soru-list/videoders-soru-list.component';
import { VideodersEgitmenListComponent } from '../../components/videoders-egitmen-list/videoders-egitmen-list.component';

@Component({
  selector: 'app-videoders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    VideodersTemelComponent,
    VideodersKonuListComponent,
    VideodersSorumlularComponent,
    VideodersUcretComponent,
    VideodersOzetComponent,
    VideodersOnkosulListComponent,
    KategoriListComponent,
    VideodersProjeListComponent,
    VideodersPaydasListComponent,
    VideodersSozlesmeListComponent,
    VideodersIslemKayitListComponent,
    VideodersSoruListComponent,
    VideodersEgitmenListComponent
],
  templateUrl: './videoders-detail-page.component.html',
  styleUrls: ['./videoders-detail-page.component.css']
})
export class VideodersDetailPageComponent implements OnInit {
  @ViewChild('egitmenList') egitmenList?: VideodersEgitmenListComponent;
  
  videoders?: VideoDersResponse;
  loading = false;
  activeTab = 'konular';
  
  kategoriler = signal<KategoriOzet[]>([]);
  kategoriLoading = signal(false);
  kategoriDeleting = signal(false);
  kategoriAdding = signal(false);
  kategoriLoaded = false; // Kategoriler yüklenip yüklenmediğini takip eder

  // Diğer sekmeler için lazy load bayrakları
  konularLoaded = true; // varsayılan sekme
  sorularLoaded = false;
  egitmenlerLoaded = false;
  projelerLoaded = false;
  paydaslarLoaded = false;
  sozlesmelerLoaded = false;
  islemlerLoaded = false;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly videodersService = inject(VideodersService);
  private readonly videodersKategoriService = inject(VideodersKategoriService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

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

  onTabChange(event: NgbNavChangeEvent): void {
    console.log('Tab değişti:', event.nextId);
    if (event.nextId === 'egitmenler') {
      setTimeout(() => {
        this.egitmenList?.loadEgitmenler();
      }, 0);
    }

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
        this.egitmenlerLoaded = true;
        break;
      case 'projeler':
        this.projelerLoaded = true;
        break;
      case 'paydaslar':
        this.paydaslarLoaded = true;
        break;
      case 'sozlesmeler':
        this.sozlesmelerLoaded = true;
        break;
      case 'islemler':
        this.islemlerLoaded = true;
        break;
    }
  }

  onEdit(videodersId: number): void {
    if (videodersId) {
      this.router.navigate(['/videoders/edit', videodersId]);
    }
  }
}
