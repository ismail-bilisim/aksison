import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { DersService } from 'src/app/core/services/api/ders.service';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { DersListComponent } from 'src/app/features/ders/components/ders-list/ders-list.component';
import { VideodersListComponent } from 'src/app/features/videoders/components/videoders-list/videoders-list.component';
import { YuzyuzedersListComponent } from 'src/app/shared/components/yuzyuzeders-list/yuzyuzeders-list.component';
import { CanlidersListComponent } from 'src/app/shared/components/canliders-list/canliders-list.component';
import { CanlidersService } from 'src/app/core/services/api/canliders.service';
import { EgitmenListComponent } from 'src/app/features/egitmen/components/egitmen-list/egitmen-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kategori-filter-page',
  standalone: true,
  imports: [CommonModule, NgbNavModule, DersListComponent, VideodersListComponent, YuzyuzedersListComponent, CanlidersListComponent, EgitmenListComponent],
  templateUrl: './kategori-filter-page.component.html',
  styleUrl: './kategori-filter-page.component.css'
})
export class KategoriFilterPageComponent implements OnInit {
  private kategoriService = inject(KategoriService);
  private dersService = inject(DersService);
  private videoDersService = inject(VideodersService);
  private yuzyuzeDersService = inject(YuzyuzedersService);
  private egitmenService = inject(EgitmenService);
  private canliDersService = inject(CanlidersService);
  private toastService = inject(ToastService);

  private router = inject(Router);

  // Kategori state
  kategoriler: KategoriOzet[] = [];
  kategorilerLoading = false;
  selectedKategoriIds: Set<number> = new Set();
  previousSelectionKey = '';

  // Tab and data state
  activeTab: 'ders' | 'videoders' | 'yuzyuzeders' | 'canliders' | 'egitmen' = 'ders';
  
  // Cached data
  cachedData = {
    ders: null as DersOzet[] | null,
    videoders: null as DersOzet[] | null,
    yuzyuzeders: null as DersOzet[] | null,
    canliders: null as DersOzet[] | null,
    egitmen: null as EgitmenOzet[] | null
  };

  // Loading states
  loadingStates = {
    ders: false,
    videoders: false,
    yuzyuzeders: false,
    canliders: false,
    egitmen: false
  };

  // Result counts
  counts = {
    ders: 0,
    videoders: 0,
    yuzyuzeders: 0,
    canliders: 0,
    egitmen: 0
  };

  readonly kategoriColorClasses = ['pill-blue','pill-green','pill-purple','pill-orange','pill-teal','pill-rose'];

  ngOnInit(): void {
    this.loadKategoriler();
  }

  loadKategoriler(): void {
    this.kategorilerLoading = true;
    this.kategoriService.getAllOzet().subscribe({
      next: (data) => {
        this.kategoriler = data;
        this.kategorilerLoading = false;
      },
      error: (err) => {
        this.toastService.error('Kategoriler yüklenirken hata oluştu.');
        this.kategorilerLoading = false;
      }
    });
  }

  toggleKategori(kategoriId: number): void {
    if (this.selectedKategoriIds.has(kategoriId)) {
      this.selectedKategoriIds.delete(kategoriId);
    } else {
      this.selectedKategoriIds.add(kategoriId);
    }
    this.checkCacheInvalidation();
  }

  isSelected(kategoriId: number): boolean {
    return this.selectedKategoriIds.has(kategoriId);
  }

  getSelectionKey(): string {
    return JSON.stringify(Array.from(this.selectedKategoriIds).sort());
  }

  checkCacheInvalidation(): void {
    const newKey = this.getSelectionKey();
    if (newKey !== this.previousSelectionKey) {
      // Clear cache if selection changed
      this.cachedData = {
        ders: null,
        videoders: null,
        yuzyuzeders: null,
        canliders: null,
        egitmen: null
      };
      this.counts = {
        ders: 0,
        videoders: 0,
        yuzyuzeders: 0,
        canliders: 0,
        egitmen: 0
      };
      this.previousSelectionKey = newKey;
    }
  }

  onTabChange(tab: 'ders' | 'videoders' | 'yuzyuzeders' | 'canliders' | 'egitmen'): void {
    this.activeTab = tab;
    this.loadTabData(tab);
  }

  loadTabData(tab: 'ders' | 'videoders' | 'yuzyuzeders' | 'canliders' | 'egitmen'): void {
    if (this.selectedKategoriIds.size === 0) {
      this.toastService.warning('En az bir kategori seçin');
      return;
    }

    // Check if data is already cached
    if (this.cachedData[tab] !== null) {
      return; // Use cached data
    }

    const kategoriIds = Array.from(this.selectedKategoriIds);
    this.loadingStates[tab] = true;

    switch (tab) {
      case 'ders':
        this.dersService.getByKategoriler(kategoriIds).subscribe({
          next: (data) => {
            this.cachedData.ders = data;
            this.counts.ders = data.length;
            this.loadingStates.ders = false;
            if (data.length === 0) {
              this.toastService.warning('Sonuç bulunamadı');
            }
          },
          error: (err) => {
            this.toastService.error('Dersler yüklenirken hata oluştu.');
            this.loadingStates.ders = false;
          }
        });
        break;

      case 'videoders':
        this.videoDersService.getByKategoriler(kategoriIds).subscribe({
          next: (data) => {
            this.cachedData.videoders = data;
            this.counts.videoders = data.length;
            this.loadingStates.videoders = false;
            if (data.length === 0) {
              this.toastService.warning('Sonuç bulunamadı');
            }
          },
          error: (err) => {
            this.toastService.error('Video dersler yüklenirken hata oluştu.');
            this.loadingStates.videoders = false;
          }
        });
        break;

      case 'yuzyuzeders':
        this.yuzyuzeDersService.getByKategoriler(kategoriIds).subscribe({
          next: (data) => {
            this.cachedData.yuzyuzeders = data;
            this.counts.yuzyuzeders = data.length;
            this.loadingStates.yuzyuzeders = false;
            if (data.length === 0) {
              this.toastService.warning('Sonuç bulunamadı');
            }
          },
          error: (err) => {
            this.toastService.error('Yüz yüze dersler yüklenirken hata oluştu.');
            this.loadingStates.yuzyuzeders = false;
          }
        });
        break;

      case 'canliders':
        this.canliDersService.getByKategoriler(kategoriIds).subscribe({
          next: (data) => {
            this.cachedData.canliders = data;
            this.counts.canliders = data.length;
            this.loadingStates.canliders = false;
            if (data.length === 0) {
              this.toastService.warning('Sonuç bulunamadı');
            }
          },
          error: (err) => {
            this.toastService.error('Canlı dersler yüklenirken hata oluştu.');
            this.loadingStates.canliders = false;
          }
        });
        break;

      case 'egitmen':
        this.egitmenService.getByKategoriler(kategoriIds).subscribe({
          next: (data) => {
            this.cachedData.egitmen = data;
            this.counts.egitmen = data.length;
            this.loadingStates.egitmen = false;
            if (data.length === 0) {
              this.toastService.warning('Sonuç bulunamadı');
            }
          },
          error: (err) => {
            this.toastService.error('Eğitmenler yüklenirken hata oluştu.');
            this.loadingStates.egitmen = false;
          }
        });
        break;
    }
  }

  getDersler(): DersOzet[] {
    return this.cachedData.ders || [];
  }

  getVideoDersler(): DersOzet[] {
    return this.cachedData.videoders || [];
  }

  getYuzyuzeDersler(): DersOzet[] {
    return this.cachedData.yuzyuzeders || [];
  }

  getCanliDersler(): DersOzet[] {
    return this.cachedData.canliders || [];
  }

  getEgitmenler(): EgitmenOzet[] {
    return this.cachedData.egitmen || [];
  }

  onVideoView(id: number) {
    if (id) {
      this.router.navigate(['/videoders/detail', id]);
    }
  }

  onYuzyuzeView(id: number) {
    if (id) {
      this.router.navigate(['/yuzyuzeders/detail', id]);
    }
  }

  onCanlidersView(id: number) {
    if (id) {
      this.router.navigate(['/canliders/detail', id]);
    }
  }

  getKategoriColorClass(index: number): string {
    return this.kategoriColorClasses[index % this.kategoriColorClasses.length];
  }
}
