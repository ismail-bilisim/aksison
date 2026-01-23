import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';
import { YuzyuzedersListComponent } from '../../components/yuzyuzeders-list/yuzyuzeders-list.component';

@Component({
  selector: 'app-yuzyuzeders-list-page',
  standalone: true,
  imports: [CommonModule, YuzyuzedersListComponent],
  templateUrl: './yuzyuzeders-list-page.component.html',
  styleUrl: './yuzyuzeders-list-page.component.css'
})
export class YuzyuzedersListPageComponent implements OnInit, OnDestroy {
  yuzyuzedersler: YuzyuzeDersResponse[] = [];
  durum?: string;
  pageTitle = 'Yüz Yüze Dersler';
  loading = false;
  error?: string;
  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: YuzyuzedersService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.durum = params.get('durum') || undefined;
      
      if (this.durum) {
        this.setPageTitle(this.durum);
        this.loadByDurum(this.durum);
      } else {
        this.pageTitle = 'Tüm Yüz Yüze Dersler';
        this.loadAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private setPageTitle(durum: string): void {
    const titleMap: Record<string, string> = {
      'aktif': 'Aktif Yüz Yüze Dersler',
      'plann': 'Planlanan Yüz Yüze Dersler',
      'anlas': 'Anlaşılan Yüz Yüze Dersler',
      'cekim': 'Çekimdeki Yüz Yüze Dersler',
      'teslim': 'Teslim Alınan Yüz Yüze Dersler',
      'odeme': 'Ödeme Aşamasındaki Yüz Yüze Dersler',
      'iptal': 'İptal Edilen Yüz Yüze Dersler',
      'tamam': 'Tamamlanan Yüz Yüze Dersler'
    };
    this.pageTitle = titleMap[durum] || 'Yüz Yüze Dersler';
  }

  private loadAll(): void {
    this.loading = true;
    this.error = undefined;
    this.yuzyuzedersler = [];

    this.service.getAllOzet().subscribe({
      next: (yuzyuzedersler) => {
        this.yuzyuzedersler = yuzyuzedersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Yüz yüze dersler yüklenemedi:', err);
        this.error = 'Yüz yüze dersler yüklenirken bir hata oluştu.';
        this.yuzyuzedersler = [];
        this.loading = false;
      }
    });
  }

  private loadByDurum(durum: string): void {
    this.loading = true;
    this.error = undefined;
    this.yuzyuzedersler = [];

    this.service.getAllByDurum(durum).subscribe({
      next: (yuzyuzedersler) => {
        this.yuzyuzedersler = yuzyuzedersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Yüz yüze dersler yüklenemedi:', err);
        this.error = 'Yüz yüze dersler yüklenirken bir hata oluştu.';
        this.yuzyuzedersler = [];
        this.loading = false;
      }
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/yuzyuzeders/detail', id]);
  }

  onNewYuzyuzeders(): void {
    this.router.navigate(['/yuzyuzeders/new']);
  }
}
