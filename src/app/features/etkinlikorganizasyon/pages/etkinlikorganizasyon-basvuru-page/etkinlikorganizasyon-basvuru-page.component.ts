import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EtkinlikOrganizasyonResponse } from '../../../../core/models/etkinlik-organizasyon-response';
import { EtkinlikOrganizasyonBasvuruRequest } from '../../../../core/models/etkinlik-organizasyon-basvuru-request';
import { EtkinlikOrganizasyonService } from '../../../../core/services/api/etkinlik-organizasyon.service';
import { EtkinlikOrganizasyonBasvuruService } from '../../../../core/services/api/etkinlik-organizasyon-basvuru.service';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-etkinlikorganizasyon-basvuru-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './etkinlikorganizasyon-basvuru-page.component.html',
  styleUrls: ['./etkinlikorganizasyon-basvuru-page.component.css']
})
export class EtkinlikOrganizasyonBasvuruPageComponent implements OnInit {
  etkinlik?: EtkinlikOrganizasyonResponse;
  loading = false;
  submitting = false;
  aciklama = '';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly etkinlikService = inject(EtkinlikOrganizasyonService);
  private readonly basvuruService = inject(EtkinlikOrganizasyonBasvuruService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadEtkinlik(+id);
    }
  }

  private loadEtkinlik(id: number): void {
    this.loading = true;
    this.etkinlikService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.etkinlik = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Etkinlik yüklenemedi:', error);
          this.loading = false;
          this.toastService.error('Etkinlik yüklenirken hata oluştu.');
        }
      });
  }

  basvuruYap(): void {
    if (!this.etkinlik?.id) return;

    this.submitting = true;
    const request: EtkinlikOrganizasyonBasvuruRequest = {
      etkinlikOrganizasyonId: this.etkinlik.id,
      aciklama: this.aciklama || undefined
    };

    this.basvuruService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Başvurunuz başarıyla kaydedildi.');
          this.router.navigate(['/etkinlikorganizasyon/detail', this.etkinlik?.id]);
        },
        error: (error) => {
          console.error('Başvuru yapılamadı:', error);
          this.submitting = false;
          this.toastService.error('Başvuru sırasında hata oluştu.');
        }
      });
  }
}
