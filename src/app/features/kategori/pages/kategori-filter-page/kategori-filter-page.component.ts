import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { DersService } from 'src/app/core/services/api/ders.service';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { DersListComponent } from 'src/app/features/ders/components/ders-list/ders-list.component';
import { VideodersListComponent } from 'src/app/features/videoders/components/videoders-list/videoders-list.component'; 
import { EgitmenListComponent } from 'src/app/features/egitmen/components/egitmen-list/egitmen-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kategori-filter-page',
  standalone: true,
  imports: [CommonModule, DersListComponent, VideodersListComponent, EgitmenListComponent],
  templateUrl: './kategori-filter-page.component.html',
  styleUrl: './kategori-filter-page.component.css'
})
export class KategoriFilterPageComponent implements OnInit {
  private kategoriService = inject(KategoriService);
  private dersService = inject(DersService);
  private videoDersService = inject(VideodersService);
  private egitmenService = inject(EgitmenService);
  private toastService = inject(ToastService);

  private router = inject(Router);

  // Kategori state
  kategoriler: KategoriOzet[] = [];
  kategorilerLoading = false;
  selectedKategoriIds: Set<number> = new Set();
  previousSelectionKey = '';

  // Tab and data state
  activeTab: 'hidden' | 'ders' | 'videoders' | 'egitmen' = 'hidden';
  
  // Cached data
  cachedData = {
    hidden: null as any | null,
    ders: null as DersOzet[] | null,
    videoders: null as DersOzet[] | null,
    egitmen: null as EgitmenOzet[] | null
  };

  // Loading states
  loadingStates = {
    hidden: false,
    ders: false,
    videoders: false,
    egitmen: false
  };

  // Result counts
  counts = {
    hidden: 0,
    ders: 0,
    videoders: 0,
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
        hidden: null,
        ders: null,
        videoders: null,
        egitmen: null
      };
      this.counts = {
        hidden: 0,
        ders: 0,
        videoders: 0,
        egitmen: 0
      };
      this.previousSelectionKey = newKey;
    }
  }

  onTabChange(tab: 'hidden' | 'ders' | 'videoders' | 'egitmen'): void {
    this.activeTab = tab;
    this.loadTabData(tab);
  }

  loadTabData(tab: 'hidden' | 'ders' | 'videoders' | 'egitmen'): void {
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

  getEgitmenler(): EgitmenOzet[] {
    return this.cachedData.egitmen || [];
  }

  getKategoriColorClass(index: number): string {
    return this.kategoriColorClasses[index % this.kategoriColorClasses.length];
  }
}
