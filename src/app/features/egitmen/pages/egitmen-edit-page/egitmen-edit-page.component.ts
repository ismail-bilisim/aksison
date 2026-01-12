import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EgitmenFormComponent } from '../../components/egitmen-form/egitmen-form.component';
import { EgitmenRequest } from '../../../../core/models/egitmen-request';
import { EgitmenResponse } from '../../../../core/models/egitmen-response';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-egitmen-edit-page',
  imports: [CommonModule, EgitmenFormComponent],
  templateUrl: './egitmen-edit-page.component.html',
  styleUrl: './egitmen-edit-page.component.css'
})
export class EgitmenEditPageComponent {
  egitmenResponse = signal<EgitmenResponse | null>(null);
  egitmenRequest = signal<EgitmenRequest | null>(null);
  isLoading = signal<boolean>(false);

  isEditMode = false;
  egitmenId?: number;

  private routeSubs?: Subscription;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private egitmenService = inject(EgitmenService);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.routeSubs = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.isEditMode = !!idParam;
      this.egitmenId = idParam ? Number(idParam) : undefined;
    });

    if (this.isEditMode && this.egitmenId) {
      this.isLoading.set(true);
      this.loadEgitmen(this.egitmenId);
    }
  }

  loadEgitmen(egitmenId: number) {
    this.egitmenService.getFullById(egitmenId).subscribe({
      next: (data) => {
        this.egitmenResponse.set(data);
        this.egitmenRequest.set(this.mapResponseToRequest(data));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error('Eğitmen yüklenirken hata oluştu.');
        console.error('Eğitmen detayı yüklenemedi:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSave(request: EgitmenRequest) {
    this.isLoading.set(true);

    const operasyon = this.isEditMode && this.egitmenResponse
      ? this.egitmenService.update(this.egitmenResponse()!.id, request)
      : this.egitmenService.create(request);

    operasyon.subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.toastService.success(`Eğitmen başarılı bir şekilde ${this.isEditMode ? 'güncellendi' : 'oluşturuldu'}.`);
        this.router.navigate(['/egitmen/detail', data.id]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error('Eğitmen kaydedilirken hata oluştu.');
        console.error('Eğitmen kaydedilemedi:', err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/egitmen']);
  }

  private mapResponseToRequest(response: EgitmenResponse): EgitmenRequest {
    // Guard against missing kullanici to avoid runtime/TS errors
    if (!response.kullanici?.id) {
      this.toastService.error('Eğitmen için kullanıcı bilgisi yok.');
      this.router.navigate(['/egitmen']);
      throw new Error('EgitmenResponse.kullanici is missing');
    }

    return {
      version: response.version,
      kullaniciId: response.kullanici.id,
      okulUniversiteAdi: response.okulUniversiteAdi,
      bolum: response.bolum,
      akademikDereceler: response.akademikDereceler,
      unvan: response.unvan,
      uzmanlikAlani: response.uzmanlikAlani,
      calisilanKurum: response.calisilanKurum,
      cevrimIciTecrubesi: response.cevrimIciTecrubesi,
      sosyalMedyaHesabi: response.sosyalMedyaHesabi,
      webSitesi: response.webSitesi,
      egitmenProfili: response.egitmenProfili,
      kisaOzgecmis: response.kisaOzgecmis
    };
  }

  ngOnDestroy() {
    this.routeSubs?.unsubscribe();
  }
}
