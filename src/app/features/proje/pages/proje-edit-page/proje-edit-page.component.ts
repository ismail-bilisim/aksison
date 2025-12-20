import { Component, inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjeFormComponent } from "../../components/proje-form/proje-form.component";
import { ProjeService } from '../../../../core/services/api/proje.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ProjeRequest } from '../../../../core/models/proje-request';
import { ProjeResponse } from '../../../../core/models/proje-response';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { CanComponentDeactivate } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-proje-edit-page',
  standalone: true,
  imports: [CommonModule, ProjeFormComponent],
  templateUrl: './proje-edit-page.component.html',
  styleUrl: './proje-edit-page.component.css'
})
export class ProjeEditPageComponent implements OnInit, CanComponentDeactivate {
  private readonly toastService = inject(ToastService);

  @ViewChild(ProjeFormComponent) formComponent?: ProjeFormComponent;

  proje?: ProjeResponse;
  isEditMode = false;
  isSaving = false;
  formDirty = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: ProjeService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.service.getById(+id).subscribe({
        next: (res) => {
          this.proje = res;
          console.log("Yüklenen proje: ", this.proje);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadProje');
          this.toastService.error('Proje yükleme hatası: ' + ErrorHandler.extractErrorMessage(error));
          this.router.navigate(['/proje']);
        }
      });
    }
  }

  onSave(projeRequest: ProjeRequest) {
    if (this.isSaving) return;

    this.isSaving = true;

    if (this.proje?.id) {
      this.service.update(this.proje.id, projeRequest).subscribe({
        next: (response) => {
          this.isSaving = false;
          this.toastService.success('Proje başarıyla güncellendi.');
          this.isSaving = true;
          this.router.navigate(['/proje', response.id]);
        },
        error: (error) => {
          this.isSaving = false;
          ErrorHandler.logError(error, 'updateProje');
          this.toastService.error('Güncelleme hatası: ' + ErrorHandler.extractErrorMessage(error));
        }
      });
    } else {
      this.service.create(projeRequest).subscribe({
        next: (response) => {
          this.toastService.success('Proje başarıyla oluşturuldu.');
          this.isSaving = true;
          this.router.navigate(['/proje', response.id]);
        },
        error: (error) => {
          this.isSaving = false;
          ErrorHandler.logError(error, 'createProje');
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
