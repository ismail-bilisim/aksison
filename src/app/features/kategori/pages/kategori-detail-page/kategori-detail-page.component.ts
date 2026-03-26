import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { Kategori } from 'src/app/core/models/kategori';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KategoriTemelComponent } from '../../components/kategori-temel/kategori-temel.component';
import { KategoriAltKategoriListComponent } from '../../components/kategori-alt-kategori-list/kategori-alt-kategori-list.component';
import { KategoriDersListComponent } from '../../components/kategori-ders-list/kategori-ders-list.component';
import { VideodersListComponent } from '../../../../shared/components/videoders-list/videoders-list.component';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { YuzyuzedersListComponent } from '../../../../shared/components/yuzyuzeders-list/yuzyuzeders-list.component';
import { CanlidersListComponent } from '../../../../shared/components/canliders-list/canliders-list.component';
import { YuzyuzedersService } from '../../../../core/services/api/yuzyuzeders.service';
import { CanlidersService } from '../../../../core/services/api/canliders.service';
import { KategoriEgitmenListComponent } from '../../components/kategori-egitmen-list/kategori-egitmen-list.component';
import { DersOzet } from '../../../../core/models/ders-ozet';

@Component({
  selector: 'app-kategori-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    KategoriTemelComponent,
    KategoriAltKategoriListComponent,
    KategoriDersListComponent,
    VideodersListComponent,
    YuzyuzedersListComponent,
    CanlidersListComponent,
    KategoriEgitmenListComponent
  ],
  templateUrl: './kategori-detail-page.component.html',
  styleUrls: ['./kategori-detail-page.component.css']
})
export class KategoriDetailPageComponent implements OnInit {
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private kategoriService = inject(KategoriService);
  private videodersService = inject(VideodersService);
  private yuzyuzedersService = inject(YuzyuzedersService);
  private canlidersService = inject(CanlidersService);

  kategori?: Kategori;
  loading = false;
  activeTab = 'altKategoriler';

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

  // Canlı dersler
  canlidersler = signal<DersOzet[]>([]);
  canlidersLoading = signal(false);
  canlidersError = signal('');
  canlidersLoaded = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.loadKategori(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadKategori(id: number): void {
    this.loading = true;
    this.kategori = undefined;

    this.kategoriService.getById(id).subscribe({
      next: (data) => {
        this.kategori = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadKategori');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }


  onBack(): void {
    this.router.navigate(['/kategori']);
  }

  navigateToKategori(kategoriId?: number): void {
    if (kategoriId) {
      this.router.navigate(['/kategori/detail', kategoriId]);
    }
  }

  onTabChange(tabId: string): void {
    if (tabId === 'videodersler' && !this.videodersLoaded) {
      this.videodersLoaded = true;
      this.loadVideodersler();
    }
    if (tabId === 'yuzyuzedersler' && !this.yuzyuzedersLoaded) {
      this.yuzyuzedersLoaded = true;
      this.loadYuzyuzedersler();
    }
    if (tabId === 'canlidersler' && !this.canlidersLoaded) {
      this.canlidersLoaded = true;
      this.loadCanlidersler();
    }
  }

  private loadVideodersler(): void {
    if (!this.kategori?.id) return;
    this.videodersLoading.set(true);
    this.videodersError.set('');
    this.videodersService.getAllozetByKategori(this.kategori.id).subscribe({
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

  onVideodersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/videoders/detail', id]);
    }
  }

  private loadYuzyuzedersler(): void {
    if (!this.kategori?.id) return;
    this.yuzyuzedersLoading.set(true);
    this.yuzyuzedersError.set('');
    this.yuzyuzedersService.getAllOzetByKategori(this.kategori.id).subscribe({
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

  onYuzyuzedersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/yuzyuzeders/detail', id]);
    }
  }

  private loadCanlidersler(): void {
    if (!this.kategori?.id) return;
    this.canlidersLoading.set(true);
    this.canlidersError.set('');
    this.canlidersService.getAllOzetByKategori(this.kategori.id).subscribe({
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
}
