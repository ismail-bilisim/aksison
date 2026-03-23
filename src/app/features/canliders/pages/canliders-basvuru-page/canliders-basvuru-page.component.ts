import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanliDersResponse } from '../../../../core/models/canliders-response';
import { CanliDersBasvuruRequest } from '../../../../core/models/canliders-basvuru-request';
import { CanlidersService } from '../../../../core/services/api/canliders.service';
import { CanliDersBasvuruService } from '../../../../core/services/api/canliders-basvuru.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { CanlidersBasvuruComponent } from '../../components/canliders-basvuru/canliders-basvuru.component';

@Component({
  selector: 'app-canliders-basvuru-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CanlidersBasvuruComponent
  ],
  templateUrl: './canliders-basvuru-page.component.html',
  styleUrls: ['./canliders-basvuru-page.component.css']
})
export class CanlidersBasvuruPageComponent implements OnInit {

  canliders?: CanliDersResponse;
  loading = false;
  submitting = false;
  aciklama = '';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly canlidersService = inject(CanlidersService);
  private readonly canliDersBasvuruService = inject(CanliDersBasvuruService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadCanliders(+id);
    }
  }

  private loadCanliders(id: number): void {
    this.loading = true;
    this.canlidersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.canliders = data;
          this.loading = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadCanliders');
          this.loading = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  basvuruYap(): void {
    if (!this.canliders?.id) return;

    this.submitting = true;
    const request: CanliDersBasvuruRequest = {
      dersId: this.canliders.id,
      aciklama: this.aciklama || undefined
    };

    this.canliDersBasvuruService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Başvurunuz başarıyla kaydedildi.');
          this.router.navigate(['/canliders/detail', this.canliders!.id]);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'basvuruYap');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }
}
