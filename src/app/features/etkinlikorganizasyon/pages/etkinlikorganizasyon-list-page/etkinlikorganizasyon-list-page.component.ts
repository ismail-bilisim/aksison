import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { EtkinlikOrganizasyonService } from 'src/app/core/services/api/etkinlik-organizasyon.service';
import { EtkinlikOrganizasyonOzet } from 'src/app/core/models/etkinlik-organizasyon-ozet';
import { EtkinlikOrganizasyonListComponent } from '../../components/etkinlikorganizasyon-list/etkinlikorganizasyon-list.component';

@Component({
  selector: 'app-etkinlikorganizasyon-list-page',
  standalone: true,
  imports: [CommonModule, EtkinlikOrganizasyonListComponent],
  templateUrl: './etkinlikorganizasyon-list-page.component.html',
  styleUrl: './etkinlikorganizasyon-list-page.component.css'
})
export class EtkinlikOrganizasyonListPageComponent implements OnInit, OnDestroy {
  etkinlikler: EtkinlikOrganizasyonOzet[] = [];
  durum?: string;
  pageTitle = 'Etkinlik ve Organizasyonlar';
  loading = false;
  error?: string;
  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: EtkinlikOrganizasyonService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.durum = params.get('durum') || undefined;

      if (this.durum) {
        this.setPageTitle(this.durum);
        this.loadByDurum(this.durum);
      } else {
        this.pageTitle = 'Tüm Etkinlik ve Organizasyonlar';
        this.loadAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private setPageTitle(durum: string): void {
    const titleMap: Record<string, string> = {
      'TASLK': 'Taslak Etkinlikler',
      'ONYBK': 'Onay Bekleyen Etkinlikler',
      'ONAYL': 'Onaylanan Etkinlikler',
      'TAMAM': 'Tamamlanan Etkinlikler',
      'REDDI': 'Reddedilen Etkinlikler',
      'IPTAL': 'İptal Edilen Etkinlikler'
    };
    this.pageTitle = titleMap[durum] || 'Etkinlik ve Organizasyonlar';
  }

  private loadAll(): void {
    this.loading = true;
    this.error = undefined;
    this.etkinlikler = [];

    this.service.getAll().subscribe({
      next: (etkinlikler) => {
        this.etkinlikler = etkinlikler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Etkinlikler yüklenemedi:', err);
        this.error = 'Etkinlikler yüklenirken bir hata oluştu.';
        this.etkinlikler = [];
        this.loading = false;
      }
    });
  }

  private loadByDurum(durum: string): void {
    this.loading = true;
    this.error = undefined;
    this.etkinlikler = [];

    this.service.getByDurumKodu(durum).subscribe({
      next: (etkinlikler) => {
        this.etkinlikler = etkinlikler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Etkinlikler yüklenemedi:', err);
        this.error = 'Etkinlikler yüklenirken bir hata oluştu.';
        this.etkinlikler = [];
        this.loading = false;
      }
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/etkinlikorganizasyon/detail', id]);
  }

  onNewEtkinlik(): void {
    this.router.navigate(['/etkinlikorganizasyon/new']);
  }
}
