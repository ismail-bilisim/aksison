import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DersService } from 'src/app/core/services/api/ders.service';
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
export class DersEditPageComponent implements OnInit {
  private toastService = inject(ToastService);

  ders?: DersResponse;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private service: DersService,
    private router: Router
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
    if (this.ders?.id) {
      this.service.update(this.ders.id, dersRequest).subscribe({
        next: () => {
          this.toastService.success('Ders başarıyla güncellendi.');
          this.router.navigate(['/ders']);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'updateDers');
          this.toastService.error('Güncelleme hatası: ' + ErrorHandler.extractErrorMessage(error));
        }
      });
    } else {
      this.service.create(dersRequest).subscribe({
        next: () => {
          this.toastService.success('Ders başarıyla oluşturuldu.');
          this.router.navigate(['/ders']);
        },
        error: (error) => {
          ErrorHandler.logError(error, 'createDers');
          this.toastService.error('Kaydetme hatası: ' + ErrorHandler.extractErrorMessage(error));
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/ders']);
  }
}
