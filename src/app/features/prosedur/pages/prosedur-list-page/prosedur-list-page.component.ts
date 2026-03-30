import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ProsedurService } from 'src/app/core/services/api/prosedur.service';
import { ProsedurOzet } from 'src/app/core/models/prosedur-ozet';
import { ProsedurListComponent } from '../../components/prosedur-list/prosedur-list.component';

@Component({
  selector: 'app-prosedur-list-page',
  standalone: true,
  imports: [CommonModule, ProsedurListComponent],
  templateUrl: './prosedur-list-page.component.html'
})
export class ProsedurListPageComponent implements OnInit, OnDestroy {
  prosedurler: ProsedurOzet[] = [];
  durum?: string;
  pageTitle = 'Prosedürler';
  loading = false;
  error?: string;
  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: ProsedurService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.durum = params.get('durum') || undefined;

      if (this.durum) {
        this.setPageTitle(this.durum);
        this.loadByDurum(this.durum);
      } else {
        this.pageTitle = 'Tüm Prosedürler';
        this.loadAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private setPageTitle(durum: string): void {
    const titleMap: Record<string, string> = {
      'TASLK': 'Taslak Prosedürler',
      'ONYBK': 'Onay Bekleyen Prosedürler',
      'YURUL': 'Yürürlükteki Prosedürler',
      'MULGA': 'Mülga Prosedürler'
    };
    this.pageTitle = titleMap[durum] || 'Prosedürler';
  }

  private loadAll(): void {
    this.loading = true;
    this.error = undefined;
    this.prosedurler = [];

    this.service.getAll().subscribe({
      next: (prosedurler) => {
        this.prosedurler = prosedurler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Prosedürler yüklenemedi:', err);
        this.error = 'Prosedürler yüklenirken bir hata oluştu.';
        this.prosedurler = [];
        this.loading = false;
      }
    });
  }

  private loadByDurum(durum: string): void {
    this.loading = true;
    this.error = undefined;
    this.prosedurler = [];

    this.service.getByDurumKodu(durum).subscribe({
      next: (prosedurler) => {
        this.prosedurler = prosedurler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Prosedürler yüklenemedi:', err);
        this.error = 'Prosedürler yüklenirken bir hata oluştu.';
        this.prosedurler = [];
        this.loading = false;
      }
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/prosedur/detail', id]);
  }

  onNewProsedur(): void {
    this.router.navigate(['/prosedur/new']);
  }
}
