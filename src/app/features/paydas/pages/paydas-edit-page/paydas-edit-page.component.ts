import { Component, inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaydasFormComponent } from "../../components/paydas-form/paydas-form.component";
import { PaydasService } from '../../../../core/services/api/paydas.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { PaydasRequest } from '../../../../core/models/paydas-request';
import { PaydasResponse } from '../../../../core/models/paydas-response';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { CanComponentDeactivate } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-paydas-edit-page',
  standalone: true,
  imports: [CommonModule, PaydasFormComponent],
  templateUrl: './paydas-edit-page.component.html',
  styleUrl: './paydas-edit-page.component.css'
})
export class PaydasEditPageComponent implements OnInit, CanComponentDeactivate {
  private readonly toastService = inject(ToastService);

  @ViewChild(PaydasFormComponent) formComponent?: PaydasFormComponent;

  paydas?: PaydasResponse;
  isEditMode = false;
  isSaving = false;
  formDirty = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: PaydasService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.service.getById(+id).subscribe({
        next: (res) => {
          this.paydas = res;
          console.log("Yüklenen paydaş: ", this.paydas);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadPaydas');
          this.toastService.error('Paydaş yükleme hatası: ' + ErrorHandler.extractErrorMessage(error));
          this.router.navigate(['/paydas']);
        }
      });
    }
  }

  onSave(paydasRequest: PaydasRequest) {
    if (this.isSaving) return;

    this.isSaving = true;

    if (this.paydas?.id) {
      this.service.update(this.paydas.id, paydasRequest).subscribe({
        next: (response) => {
          this.isSaving = false;
          this.toastService.success('Paydaş başarıyla güncellendi.');
          this.router.navigate(['/paydas', response.id]);
        },
        error: (error) => {
          this.isSaving = false;
          ErrorHandler.logError(error, 'updatePaydas');
          this.toastService.error('Güncelleme hatası: ' + ErrorHandler.extractErrorMessage(error));
        }
      });
    } else {
      this.service.create(paydasRequest).subscribe({
        next: (response) => {
          this.isSaving = false;
          this.toastService.success('Paydaş başarıyla oluşturuldu.');
          this.router.navigate(['/paydas', response.id]);
        },
        error: (error) => {
          this.isSaving = false;
          ErrorHandler.logError(error, 'createPaydas');
          this.toastService.error('Kaydetme hatası: ' + ErrorHandler.extractErrorMessage(error));
        }
      });
    }
  }

  onFormDirtyChange(isDirty: boolean) {
    this.formDirty = isDirty;
  }

  canDeactivate(): boolean {
    if (!this.formDirty || this.isSaving) {
      return true;
    }
    return confirm('Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istediğinizden emin misiniz?');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.formDirty && !this.isSaving) {
      $event.returnValue = true;
    }
  }
}
