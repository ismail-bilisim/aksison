import { Component, OnInit, ViewChild, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SoruService } from 'src/app/core/services/api/soru.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { SoruRequest } from 'src/app/core/models/soru-request';
import { SoruResponse } from 'src/app/core/models/soru-response';
import { SoruFormComponent } from '../../components/soru-form/soru-form.component';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Component({
  selector: 'app-soru-edit-page',
  standalone: true,
  imports: [CommonModule, SoruFormComponent],
  templateUrl: './soru-edit-page.component.html',
  styleUrl: './soru-edit-page.component.css'
})
export class SoruEditPageComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(SoruFormComponent) formComponent?: SoruFormComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly soruService = inject(SoruService);
  private readonly toastService = inject(ToastService);

  soru?: SoruResponse;
  isEditMode = false;
  isSaving = false;
  formDirty = false;

constructor() {
  console.log('Component constructor çalıştı');
}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSoru(+id);
    }
  }

  private loadSoru(id: number): void {
    this.soruService.getById(id).subscribe({
      next: (data) => {
        this.soru = data;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadSoru');
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
        this.router.navigate(['/soru']);
      }
    });
  }

  onSave(soruRequest: SoruRequest): void {
    if (this.isSaving) return;
    this.isSaving = true;

    if (this.isEditMode && this.soru?.id) {
      this.soruService.update(this.soru.id, soruRequest).subscribe({
        next: (response) => {
            console.log('NEXT çalıştı');
        console.log('response:', response);
          this.toastService.success('Soru başarıyla güncellendi');
          this.formDirty = false;
          this.isSaving = false;
          this.router.navigate(['/soru/detail', response.id]);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'updateSoru');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.isSaving = false;
        }
      });
    } else {
        console.log('Else çalıştı');

        this.soruService.create(soruRequest).subscribe({
        next: (response) => {
        console.log('NEXT çalıştı');
            console.log('response:', response);          
        this.toastService.success('Soru başarıyla oluşturuldu');
          this.formDirty = false;
          this.isSaving = false;

          this.router.navigate(['/soru/detail', response.id]);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'createSoru');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.isSaving = false;
        }
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.soru?.id) {
      this.router.navigate(['/soru/detail', this.soru.id]);
    } else {
      this.router.navigate(['/soru']);
    }
  }

  onFormDirtyChange(dirty: boolean): void {
    this.formDirty = dirty;
  }

  canDeactivate(): boolean {
    if (!this.formDirty || this.isSaving) {
      return true;
    }
    return confirm('Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istediğinize emin misiniz?');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.formDirty && !this.isSaving) {
      $event.returnValue = true;
    }
  }
}
