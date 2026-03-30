import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ProsedurService } from 'src/app/core/services/api/prosedur.service';
import { ProsedurOzet } from 'src/app/core/models/prosedur-ozet';
import { ProsedurListComponent } from '../../components/prosedur-list/prosedur-list.component';

@Component({
  selector: 'app-prosedur-list-bytur-page',
  standalone: true,
  imports: [CommonModule, ProsedurListComponent],
  templateUrl: './prosedur-list-bytur-page.component.html'
})
export class ProsedurListByTurPageComponent implements OnInit, OnDestroy {
  prosedurler: ProsedurOzet[] = [];
  surecTuruKodu?: string;
  pageTitle = 'Prosedürler';
  loading = false;
  error?: string;
  private routeSubscription?: Subscription;

  private readonly titleMap: Record<string, string> = {
    'VDERS': 'Video Ders Prosedürleri',
    'YDERS': 'Yüzyüze Ders Prosedürleri',
    'CDERS': 'Canlı Ders Prosedürleri',
    'EGTMN': 'Eğitmen Prosedürleri'
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: ProsedurService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.surecTuruKodu = params.get('surecTuruKodu') || undefined;
      this.pageTitle = this.surecTuruKodu
        ? (this.titleMap[this.surecTuruKodu] ?? 'Prosedürler')
        : 'Prosedürler';

      if (this.surecTuruKodu) {
        this.load(this.surecTuruKodu);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private load(kodu: string): void {
    this.loading = true;
    this.error = undefined;
    this.prosedurler = [];

    this.service.getBySurecTuruKodu(kodu).subscribe({
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
}
