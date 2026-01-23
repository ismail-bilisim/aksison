import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { OnayDurumu } from '../../../../core/models/onay-durumu.enum';
import { YuzyuzeDersResponse } from '../../../../core/models/yuzyuzeders-response';
import { YuzyuzedersService } from '../../../../core/services/api/yuzyuzeders.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { YuzyuzedersTemelComponent } from '../../components/yuzyuzeders-temel/yuzyuzeders-temel.component';
import { ApprovalDialogComponent, ApprovalDialogData } from 'src/app/shared/components/approval-dialog/approval-dialog.component';

@Component({
  selector: 'app-yuzyuzeders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    YuzyuzedersTemelComponent
  ],
  templateUrl: './yuzyuzeders-detail-page.component.html',
  styleUrls: ['./yuzyuzeders-detail-page.component.css']
})
export class YuzyuzedersDetailPageComponent implements OnInit {
  yuzyuzeders?: YuzyuzeDersResponse;
  loading = false;
  submitting = false;
  
  // Enum for template
  readonly OnayDurumu = OnayDurumu;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly dialog = inject(Dialog);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  // Modal input değerleri
  onayNotu: string = '';
  redNedeni: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !Number.isNaN(+id)) {
      this.loadYuzyuzeders(+id);
    }
  }

  loadYuzyuzeders(id: number): void {
    this.loading = true;
    this.yuzyuzeders = undefined;

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

  onEdit(id?: number): void {
    const dersId = id || this.yuzyuzeders?.id;
    if (dersId) {
      this.router.navigate(['/yuzyuzeders/edit', dersId]);
    }
  }

  icerikOnayinaSun(): void {
    if (!this.yuzyuzeders?.id) return;

    if (!confirm('İçeriği onaya sunmak istediğinize emin misiniz?')) {
      return;
    }

    this.submitting = true;
    this.yuzyuzedersService.icerikOnayinaSun(this.yuzyuzeders.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('İçerik başarıyla onaya sunuldu.');
          this.loadYuzyuzeders(this.yuzyuzeders!.id);
          this.submitting = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'icerikOnayinaSun');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.submitting = false;
        }
      });
  }

  icerikOnayla(): void {
    if (!this.yuzyuzeders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: {
        title: 'İçerik Onay',
        message: 'İçeriği onaylamak istediğinize emin misiniz?',
        noteLabel: 'Onay Notu (İsteğe Bağlı)',
        confirmText: 'Onayla',
        appearance: 'approve'
      } as ApprovalDialogData,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined) {
          this.submitting = true;
          this.yuzyuzedersService.icerikOnayla(this.yuzyuzeders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('İçerik başarıyla onaylandı.');
                this.loadYuzyuzeders(this.yuzyuzeders!.id);
                this.submitting = false;
              },
              error: (error) => {
                ErrorHandler.logError(error, 'icerikOnayla');
                this.toastService.error(ErrorHandler.extractErrorMessage(error));
                this.submitting = false;
              }
            });
        }
      });
  }

  icerikReddet(): void {
    if (!this.yuzyuzeders?.id) return;

    const dialogRef = this.dialog.open<string>(ApprovalDialogComponent, {
      data: {
        title: 'İçerik Red',
        message: 'İçeriği reddetmek istediğinize emin misiniz?',
        noteLabel: 'Red Nedeni (Zorunlu)',
        confirmText: 'Reddet',
        appearance: 'reject'
      } as ApprovalDialogData,
      width: '500px',
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result !== undefined) {
          this.submitting = true;
          this.yuzyuzedersService.icerikReddet(this.yuzyuzeders!.id, result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.toastService.success('İçerik reddedildi.');
                this.loadYuzyuzeders(this.yuzyuzeders!.id);
                this.submitting = false;
              },
              error: (error) => {
                ErrorHandler.logError(error, 'icerikReddet');
                this.toastService.error(ErrorHandler.extractErrorMessage(error));
                this.submitting = false;
              }
            });
        }
      });
  }
}
