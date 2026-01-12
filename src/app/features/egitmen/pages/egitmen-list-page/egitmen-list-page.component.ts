import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgitmenListComponent } from '../../components/egitmen-list/egitmen-list.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-egitmen-list-page',
  imports: [CommonModule, EgitmenListComponent, RouterModule],
  templateUrl: './egitmen-list-page.component.html',
  styleUrl: './egitmen-list-page.component.css'
})
export class EgitmenListPageComponent implements OnInit {
  private egitmenService = inject(EgitmenService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  egitmenler: EgitmenOzet[] = [];
  isLoading = signal(false);
  pageTitle = signal('Tüm Eğitmenler');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const onayKodu = params['onayKodu'];
      const aktifMi = params['aktifMi'];

      if (onayKodu) {
        this.loadByOnayDurumu(onayKodu);
      } else if (aktifMi !== undefined) {
        this.loadByAktifMi(aktifMi === 'true');
      } else {
        this.loadAll();
      }
    });
  }

  loadAll(): void {
    this.isLoading.set(true);
    this.pageTitle.set('Tüm Eğitmenler');
    this.egitmenService.getAllOzet().subscribe({
      next: (egitmenler) => {
        this.egitmenler = egitmenler;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error('Eğitmenler yüklenirken hata oluştu.');
        console.error(err);
        this.egitmenler = [];
        this.isLoading.set(false);
      }
    });
  }

  loadByOnayDurumu(onayKodu: string): void {
    this.isLoading.set(true);
    const titles: { [key: string]: string } = {
      'tas': 'Taslak Eğitmenler',
      'ons': 'Onay Bekleyen Eğitmenler',
      'red': 'Reddedilen Eğitmenler',
      'ony': 'Onaylı Eğitmenler'
    };
    this.pageTitle.set(titles[onayKodu] || 'Eğitmenler');

    this.egitmenService.getAllByOnayDurumu(onayKodu).subscribe({
      next: (egitmenler) => {
        this.egitmenler = egitmenler;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error('Eğitmenler yüklenirken hata oluştu.');
        console.error(err);
        this.egitmenler = [];
        this.isLoading.set(false);
      }
    });
  }

  loadByAktifMi(aktifMi: boolean): void {
    this.isLoading.set(true);
    this.pageTitle.set(aktifMi ? 'Aktif Eğitmenler' : 'Pasif Eğitmenler');

    this.egitmenService.getAllByAktifMi(aktifMi).subscribe({
      next: (egitmenler) => {
        this.egitmenler = egitmenler;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error('Eğitmenler yüklenirken hata oluştu.');
        console.error(err);
        this.egitmenler = [];
        this.isLoading.set(false);
      }
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/egitmen/detail', id]);
  }

  editEgitmen(id: number): void {
    this.router.navigate(['/egitmen/edit', id]);
  }

  createNew(): void {
    this.router.navigate(['/egitmen/new']);
  }
}
