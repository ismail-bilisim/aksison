import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PaydasService } from '../../../../core/services/api/paydas.service';
import { PaydasResponse } from '../../../../core/models/paydas-response';
import { PaydasRequest } from '../../../../core/models/paydas-request';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-paydas-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './paydas-detail-page.component.html',
  styleUrls: ['./paydas-detail-page.component.css']
})
export class PaydasDetailPageComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paydasService = inject(PaydasService);
  private readonly modalService = inject(NgbModal);

  paydas?: PaydasResponse;
  loading = false;
  editMode = false;
  saving = false;
  submitting = false;

  // Modal referansları
  @ViewChild('onayModal') onayModalTemplate!: TemplateRef<any>;
  @ViewChild('redModal') redModalTemplate!: TemplateRef<any>;
  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !Number.isNaN(+id)) {
        this.loadPaydas(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadPaydas(id: number): void {
    this.loading = true;
    this.paydas = undefined;

    this.paydasService.getById(id).subscribe({
      next: (data) => {
        this.paydas = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadPaydas');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/paydas']);
  }

  onEdit(): void {
    this.editMode = true;
    this.router.navigate(['/paydas/edit', this.paydas?.id]);
  }

  onCancelEdit(): void {
    this.editMode = false;
  }

  onSave(paydasData: PaydasRequest): void {
    if (!this.paydas?.id) {
      return;
    }

    this.saving = true;
    this.paydasService.update(this.paydas.id, paydasData).subscribe({
      next: (updatedPaydas) => {
        this.toastService.success('Paydaş başarıyla güncellendi.');
        this.paydas = updatedPaydas;
        this.editMode = false;
        this.saving = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'updatePaydas');
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
        this.saving = false;
      }
    });
  }

  icerikOnayinaSun(): void {
    if (!this.paydas?.id || this.submitting) {
      return;
    }
    this.submitting = true;
    this.paydasService.icerikOnayinaSun(this.paydas.id).subscribe({
      next: (updated) => {
        this.paydas = updated;
        this.submitting = false;
        this.toastService.success('Paydaş başarıyla onaya gönderildi.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikOnayinaSun');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  icerikOnayla(): void {
    if (!this.paydas?.id) return;

    this.submitting = true;
    this.paydasService.icerikOnayla(this.paydas.id).subscribe({
      next: (updated) => {
        this.paydas = updated;
        this.submitting = false;
        this.toastService.success('Paydaş onaylandı.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikOnayla');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }



  icerikReddet(): void {
    if (!this.paydas?.id) return;

    this.submitting = true;
    this.paydasService.icerikReddet(this.paydas.id).subscribe({
      next: (updated) => {
        this.paydas = updated;
        this.submitting = false;
        this.toastService.info('Paydaş reddedildi.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikReddet');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  getOnayDurumuBadgeClass(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'bg-warning';
      case 'ons': return 'bg-info';
      case 'red': return 'bg-danger';
      case 'ony': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getOnayDurumuText(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'Taslak';
      case 'ons': return 'Onay Bekliyor';
      case 'red': return 'Reddedildi';
      case 'ony': return 'Onaylandı';
      default: return onayDurumu;
    }
  }
}
