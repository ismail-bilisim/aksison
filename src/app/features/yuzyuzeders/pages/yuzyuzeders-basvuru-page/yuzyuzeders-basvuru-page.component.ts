import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { YuzyuzeDersResponse } from '../../../../core/models/yuzyuzeders-response';
import { YuzyuzeDersBasvuruRequest } from '../../../../core/models/yuzyuzeders-basvuru-request';
import { YuzyuzedersService } from '../../../../core/services/api/yuzyuzeders.service';
import { YuzyuzeDersBasvuruService } from '../../../../core/services/api/yuzyuzeders-basvuru.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { YuzyuzedersBasvuruComponent } from '../../components/yuzyuzeders-basvuru/yuzyuzeders-basvuru.component';

@Component({
  selector: 'app-yuzyuzeders-basvuru-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    YuzyuzedersBasvuruComponent
  ],
  templateUrl: './yuzyuzeders-basvuru-page.component.html',
  styleUrls: ['./yuzyuzeders-basvuru-page.component.css']
})
export class YuzyuzedersBasvuruPageComponent implements OnInit {

  yuzyuzeders?: YuzyuzeDersResponse;
  loading = false;
  submitting = false;
  aciklama = '';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly yuzyuzeDersBasvuruService = inject(YuzyuzeDersBasvuruService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadYuzyuzeders(+id);
    }
  }

  private loadYuzyuzeders(id: number): void {
    this.loading = true;
    this.yuzyuzedersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.yuzyuzeders = data;
          this.loading = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadYuzyuzeders');
          this.loading = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }

  basvuruYap(): void {
    if (!this.yuzyuzeders?.id) return;

    this.submitting = true;
    const request: YuzyuzeDersBasvuruRequest = {
      dersId: this.yuzyuzeders.id,
      aciklama: this.aciklama || undefined
    };

    this.yuzyuzeDersBasvuruService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Başvurunuz başarıyla kaydedildi.');
          this.router.navigate(['/yuzyuzeders/detail', this.yuzyuzeders!.id]);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'basvuruYap');
          this.submitting = false;
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
  }
}
