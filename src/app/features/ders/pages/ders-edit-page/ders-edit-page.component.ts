import { Component, inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DersService } from 'src/app/core/services/api/ders.service';
import { CanComponentDeactivate } from 'src/app/core/guards/unsaved-changes.guard';
import { DersRequest } from 'src/app/core/models/ders-request';
import { DersResponse } from 'src/app/core/models/ders-response';
import { DersFormComponent } from "src/app/features/ders/components/ders-form/ders-form.component";
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-ders-edit-page',
  standalone: true,
  imports: [DersFormComponent],
  templateUrl: './ders-edit-page.component.html',
  styleUrl: './ders-edit-page.component.css'
})
export class DersEditPageComponent implements OnInit, CanComponentDeactivate {
  private readonly toastService = inject(ToastService);

  @ViewChild(DersFormComponent) formComponent?: DersFormComponent;

  ders?: DersResponse;
  isEditMode = false;
  isSaving = false;
  formDirty = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: DersService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.service.getById(+id).subscribe({
        next: (res) => {
          this.ders = res;
          console.log("Yüklenen ders: ", this.ders);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadDers');
          this.toastService.error('Ders yükleme hatası: ' + ErrorHandler.extractErrorMessage(error));
          this.router.navigate(['/ders']);
        }
      });
    }
  }

  onSave(dersRequest: DersRequest) {
    if (this.isSaving) return;

    this.isSaving = true;

    if (this.ders?.id) {
      this.service.update(this.ders.id, dersRequest).subscribe({
        next: (response) => {
          this.isSaving = false;
          this.toastService.success('Ders başarıyla güncellendi.');
          this.router.navigate(['/ders', response.id]);
        },
        error: (error) => {
          this.isSaving = false;
          ErrorHandler.logError(error, 'updateDers');
          this.toastService.error('Güncelleme hatası: ' + ErrorHandler.extractErrorMessage(error));
        }
      });
    } else {
      this.service.create(dersRequest).subscribe({
        next: (response) => {
          this.isSaving = false;
          this.toastService.success('Ders başarıyla oluşturuldu.');
          this.router.navigate(['/ders', response.id]);
        },
        error: (error) => {
          this.isSaving = false;
          ErrorHandler.logError(error, 'createDers');
          this.toastService.error('Kaydetme hatası: ' + ErrorHandler.extractErrorMessage(error));
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/ders']);
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
