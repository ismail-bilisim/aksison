import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { TalepFormComponent } from '../../components/talep-form/talep-form.component';
import { TalepRequest } from 'src/app/core/models/talep-request';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepEkdosyaService as TalepEkdosyaService } from 'src/app/core/services/api/talep-ekdosya.service';
import { forkJoin, of, catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TalepResponse } from 'src/app/core/models/talep-response';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { LookupService } from 'src/app/core/services/api/lookup.service';

@Component({
  selector: 'app-talep-edit-page',
  templateUrl: './talep-edit-page.component.html',
  styleUrls: ['./talep-edit-page.component.css'],
  standalone: true,
  imports: [CommonModule, TalepFormComponent]
})
export class TalepEditPageComponent {
  // State yönetimi
  talepResponse = signal<TalepResponse | null>(null);
  talepRequest = signal<TalepRequest | null>(null);
  isLoading = signal<boolean>(false); // sayfa yüklemesi. Html için

  isEditMode = false;
  talepId?: number;

  private routeSubs?: Subscription;


  // Dependency Injection
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private talepService = inject(TalepService); // Angular 19’ta önerilen (modern) inject() kullanmaktır. constructor injection hala geçerli.
  private lookupService = inject(LookupService);

  private toastService = inject(ToastService);
  private talepEkdosyaService = inject(TalepEkdosyaService);

  talepKonusu$ = this.lookupService.getAllTalepKonusuOzet(); // (Observable değişkeni) için en doğru yer çoğu zaman class gövdesi (field initializer)’dır.
  //  Yani constructor/ngOnInit dışında

  constructor(

  ) {

  }

  // Lifecycle - veri yükleme
  ngOnInit() {
    this.routeSubs = this.route.paramMap.subscribe
      (params => {
        const idParam = params.get('id');
        this.isEditMode = !!idParam;
        this.talepId = idParam ? Number(idParam) : undefined;
      }
      );

    if (this.isEditMode && this.talepId) {
      this.isLoading.set(true);
      this.loadTalep(this.talepId);
      console.log('Edit Modu:', this.isEditMode, 'ID:', this.talepId);
    }

  }


  loadTalep(talepId: number) {
    this.talepService.getById(talepId).subscribe({
      next: (data) => {
        this.talepResponse.set(data);
        this.talepRequest.set(this.mapResponseToRequest(this.talepResponse()));
        console.log('Yüklenen Talep:', data);
        console.log('Mapped TalepRequest:', this.talepRequest());
        this.isLoading.set(false);},
      error: (err) => {
        this.toastService.error('Talep yüklenirken hata oluştu.');
        console.error('Talep detayı yüklenemedi:', err);
        this.isLoading.set(false);
      },

    });

  }

  // Event handler'lar - iş mantığı
  onSave(payload: { request: TalepRequest; files: File[] }) {
    const talepRequest = payload.request;
    const files = payload.files || [];

    console.log('Form submitted with value:', talepRequest, 'files:', files);

    this.isLoading.set(true);

    if (!this.isEditMode) {
      // Version değeri create için 1
      talepRequest.version = 1;
    }

    const operasyon = this.isEditMode && this.talepResponse ?
      this.talepService.update(this.talepResponse()!.id, talepRequest)
      : this.talepService.create(talepRequest)

    operasyon.subscribe({
      next: (data) => {
        // if there are files selected, upload them
        if (files && files.length > 0) {
          const uploads = files.map(
            f => this.talepEkdosyaService.uploadFile(f, data.id)
          );


          forkJoin(uploads).subscribe({
            next: (results) => {
              this.isLoading.set(false);
              this.toastService.success(`Talep kaydedildi ve ${results.filter(r=>r).length} dosya yüklendi.`);
              this.router.navigate(['/talep/detail', data.id]);
            },
            error: (err) => {
              this.isLoading.set(false);
              // unlikely because uploads are wrapped, but handle
              console.error('Dosya yüklemede hata:', err);
              this.toastService.warning('Talep kaydedildi ama dosya yüklemede hata oluştu.');
              this.router.navigate(['/talep/detail', data.id]);
            }
          });
        } else {
          this.isLoading.set(false);
          this.toastService.success(`Talep başarılı bir şekilde ${this.isEditMode ? 'güncellendi' : 'oluşturuldu'}.`);
          this.router.navigate(['/talep/detail', data.id]); // Detay sayfasına yönlendir
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastService.error("Talep kaydedilirken hata oluştu.");
        console.error('Talep kaydedilemedi:', err);
      }
    });

  }

  onCancel() {
    this.router.navigate(['/talep']);
  }


  ngOnDestroy() {
    this.routeSubs?.unsubscribe();
  }

  private mapResponseToRequest(response: TalepResponse | null): TalepRequest {
    if (!response) {
      throw new Error('TalepResponse boş geldi.');
    }

    if (!response.id) {
      throw new Error('TalepResponse.id alanı eksik.');
    }

    if (!response.version) {
      throw new Error('TalepResponse.version alanı eksik.');
    }

    console.log('Mapping TalepResponse to TalepRequest:', response);
    return {
      version: response.version, // Backend'den gelen version değerini koru
      talepTarihi: response.talepTarihi ?? undefined,
      talepSahibi: response.talepSahibi ?? undefined,
      talepKonusuKodu: response.talepKonusu.kodu ?? undefined,
      talepIcerik: response.talepIcerik ?? undefined,
      acilMi: response.acilMi 

    };
  }

}
