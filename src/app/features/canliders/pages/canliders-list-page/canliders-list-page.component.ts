import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { CanlidersService } from 'src/app/core/services/api/canliders.service';
import { CanliDersResponse } from 'src/app/core/models/canliders-response';
import { CanlidersListComponent } from '../../components/canliders-list/canliders-list.component';

@Component({
  selector: 'app-canliders-list-page',
  standalone: true,
  imports: [CommonModule, CanlidersListComponent],
  templateUrl: './canliders-list-page.component.html',
  styleUrl: './canliders-list-page.component.css'
})
export class CanlidersListPageComponent implements OnInit, OnDestroy {
  canlidersler: CanliDersResponse[] = [];
  durum?: string;
  pageTitle = 'Canlı Dersler';
  loading = false;
  error?: string;
  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: CanlidersService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.durum = params.get('durum') || undefined;
      
      if (this.durum) {
        this.setPageTitle(this.durum);
        this.loadByDurum(this.durum);
      } else {
        this.pageTitle = 'Tüm Canlı Dersler';
        this.loadAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private setPageTitle(durum: string): void {
    const titleMap: Record<string, string> = {
      'TASLK': 'Taslak Dersler',
      'DBONS': 'Başlatma Onayına Sunulanlar',
      'DBONY': 'Başlatma Onayı Verilenler',
      'DBRED': 'Başlatma Reddedilenler',
      'ICEGN': 'İçeriği Eğitmene Gönderilenler',
      'EICOS': 'İçerik Onayına Sunulanlar',
      'ICONY': 'İçerik Onaylananlar',
      'ICRED': 'İçerik Reddedilenler',
      'SOZET': 'Sözleşme Talep Edilenler',
      'IPTAL': 'İptal Edilenler'
    };
    this.pageTitle = titleMap[durum] || 'Canlı Dersler';
  }

  private loadAll(): void {
    this.loading = true;
    this.error = undefined;
    this.canlidersler = [];

    this.service.getAllOzet().subscribe({
      next: (canlidersler) => {
        this.canlidersler = canlidersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Canlı dersler yüklenemedi:', err);
        this.error = 'Canlı dersler yüklenirken bir hata oluştu.';
        this.canlidersler = [];
        this.loading = false;
      }
    });
  }

  private loadByDurum(durum: string): void {
    this.loading = true;
    this.error = undefined;
    this.canlidersler = [];

    this.service.getAllByDurum(durum).subscribe({
      next: (canlidersler) => {
        this.canlidersler = canlidersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Canlı dersler yüklenemedi:', err);
        this.error = 'Canlı dersler yüklenirken bir hata oluştu.';
        this.canlidersler = [];
        this.loading = false;
      }
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/canliders/detail', id]);
  }

  onNewCanliders(): void {
    this.router.navigate(['/canliders/new']);
  }
}
