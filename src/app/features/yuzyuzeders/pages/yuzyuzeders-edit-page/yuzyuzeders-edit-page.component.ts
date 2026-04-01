import { Component, DestroyRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';
import { YuzyuzeDersRequest } from 'src/app/core/models/yuzyuzeders-request';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';
import { YuzyuzedersFormComponent } from '../../components/yuzyuzeders-form/yuzyuzeders-form.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { LookupService } from 'src/app/core/services/api/lookup.service';
import { YuzyuzedersLookupData } from 'src/app/core/models/yuzyuzeders-lookup-data';
import { DersService } from 'src/app/core/services/api/ders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yuzyuzeders-edit-page',
  standalone: true,
  imports: [YuzyuzedersFormComponent, RouterLink, CommonModule],
  templateUrl: './yuzyuzeders-edit-page.component.html',
  styleUrls: ['./yuzyuzeders-edit-page.component.css']
})
export class YuzyuzedersEditPageComponent implements OnInit, OnDestroy {
  // Signals for reactive state management (Angular 19)
  yuzyuzedersResponse = signal<YuzyuzeDersResponse | undefined>(undefined);
  yuzyuzedersRequest = signal<YuzyuzeDersRequest | undefined>(undefined);
  lookupData = signal<YuzyuzedersLookupData | undefined>(undefined);
  isLoadingLookups = signal<boolean>(false);
  isLoadingDersDetay = signal<boolean>(false);
  
  isEditMode = false;
  
  private routeSub?: Subscription;
  private currentId?: number;
  
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly lookupService = inject(LookupService);
  private readonly dersService = inject(DersService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    // Lookup verilerini yükle (cache'li, tek seferlik)
    this.loadLookupData();

    // Route parametrelerini dinle
    // Route parametrelerini dinle
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.isEditMode = !!idParam;
      this.currentId = idParam ? Number(idParam) : undefined;

      if (this.isEditMode && this.currentId) {
        this.loadYuzyuzeders(this.currentId);
      } else {
        this.yuzyuzedersResponse.set(undefined);
        this.yuzyuzedersRequest.set(undefined);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  /**
   * Lookup verilerini yükle (cache'li servis sayesinde tek seferlik)
   */
  private loadLookupData(): void {
    this.isLoadingLookups.set(true);
    this.lookupService.getYuzyuzedersLookups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.lookupData.set(data);
          this.isLoadingLookups.set(false);
          console.log('Lookup verileri yüklendi:', data);
        },
        error: (error) => {
          console.error('Lookup verileri yüklenirken hata oluştu:', error);
          this.toastService.error('Lookup verileri yüklenirken hata oluştu.');
          this.isLoadingLookups.set(false);
        }
      });
  }

  /**
   * Ders seçildiğinde detay yükle ve form'a patch et
   */
  onDersSelected(dersId: number): void {
    this.isLoadingDersDetay.set(true);
    this.dersService.getById(dersId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ders) => {
          console.log('Yüklenen Ders detayı:', ders);
          
          // Mevcut form değerlerini al
          const currentRequest = this.yuzyuzedersRequest();
          
          // Ders detayından patch yapılacak alanları hazırla
          const patch: Partial<YuzyuzeDersRequest> = {
            ...currentRequest,
            adi: ders.adi,
            amaci: ders.amaci ?? currentRequest?.amaci,
            dersOzeti: ders.dersOzeti ?? currentRequest?.dersOzeti,
            turuKodu: ders.turu?.kodu ?? currentRequest?.turuKodu,
            seviyesiKodu: ders.seviyesi?.kodu ?? currentRequest?.seviyesiKodu,
            niteligiKodu: ders.niteligi?.kodu ?? currentRequest?.niteligiKodu,
            hedefKitleEgitimSeviyeKodu: ders.hedefKitleEgitimSeviye?.kodu !== undefined 
              ? String(ders.hedefKitleEgitimSeviye.kodu) 
              : currentRequest?.hedefKitleEgitimSeviyeKodu,
            ilgiAlaninaGoreHedefKitle: ders.ilgiAlaninaGoreHedefKitle ?? currentRequest?.ilgiAlaninaGoreHedefKitle,
            kullanilacakProgramlar: ders.kullanilacakProgramlar ?? currentRequest?.kullanilacakProgramlar,
            kazanimlar: ders.kazanimlar ?? currentRequest?.kazanimlar,
            sikcaSorulanSorular: ders.sikcaSorulanSorular ?? currentRequest?.sikcaSorulanSorular
          };

          this.yuzyuzedersRequest.set(patch as YuzyuzeDersRequest);
          this.isLoadingDersDetay.set(false);
        },
        error: (error) => {
          console.error('Ders detayı yüklenirken hata oluştu:', error);
          this.toastService.error('Ders detayı yüklenirken hata oluştu.');
          this.isLoadingDersDetay.set(false);
        }
      });
  }

  onSave(payload: YuzyuzeDersRequest): void {
    const requestWithVersion: YuzyuzeDersRequest = {
      ...payload,
      version: this.isEditMode && this.yuzyuzedersResponse() 
        ? this.yuzyuzedersResponse()!.version 
        : 1
    };

    if (this.isEditMode && this.currentId) {
      this.updateYuzyuzeders(requestWithVersion);
    } else {
      this.createYuzyuzeders(requestWithVersion);
    }
  }

  private createYuzyuzeders(request: YuzyuzeDersRequest): void {
    this.yuzyuzedersService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.toastService.success('Yüzyüze ders başarıyla oluşturuldu.');
          this.router.navigate(['/yuzyuzeders/detail', response.id]);
        },
        error: (error) => {
          console.error('Yüzyüze ders oluşturulurken hata oluştu:', error);
          this.toastService.error('Yüzyüze ders oluşturulurken hata oluştu.');
        }
      });
  }

  private updateYuzyuzeders(request: YuzyuzeDersRequest): void {
    this.yuzyuzedersService.update(this.currentId!, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Yüzyüze ders başarıyla güncellendi.');
          this.router.navigate(['/yuzyuzeders/detail', this.currentId]);
        },
        error: (error) => {
          console.error('Yüzyüze ders güncellenirken hata oluştu:', error);
          this.toastService.error('Yüzyüze ders güncellenirken hata oluştu.');
        }
      });
  }

  private loadYuzyuzeders(id: number): void {
    this.yuzyuzedersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.yuzyuzedersResponse.set(response);
          this.yuzyuzedersRequest.set(this.mapResponseToRequest(response));
          console.log('Yüklenen YuzyuzeDersResponse:', response);
        },
        error: (error) => {
          console.error('Yüzyüze ders yüklenirken hata oluştu:', error);
          this.toastService.error('Yüzyüze ders yüklenirken hata oluştu.');
          this.router.navigate(['/yuzyuzeders']);
        }
      });
  }

  private mapResponseToRequest(response: YuzyuzeDersResponse): YuzyuzeDersRequest {
    return {
      adi: response.adi,
      version: response.version,
      dersId: response.ders?.id ?? undefined,
      amaci: response.amaci ?? undefined,
      turuKodu: response.turu?.kodu ?? undefined,
      seviyesiKodu: response.seviyesi?.kodu ?? undefined,
      niteligiKodu: response.niteligi?.kodu ?? undefined,
      hedefKitleEgitimSeviyeKodu: response.hedefKitleEgitimSeviye?.kodu ?? undefined,
      ilgiAlaninaGoreHedefKitle: response.ilgiAlaninaGoreHedefKitle ?? undefined,
      kullanilacakProgramlar: response.kullanilacakProgramlar ?? undefined,
      kazanimlar: response.kazanimlar ?? undefined,
      sikcaSorulanSorular: response.sikcaSorulanSorular ?? undefined,
      sartlar: response.sartlar ?? undefined,
      dersOzeti: response.dersOzeti ?? undefined,
      dersSuresi: response.dersSuresi ?? undefined,
      baslamaTarihi: response.baslamaTarihi ?? undefined,
      bitisTarihi: response.bitisTarihi ?? undefined,
      egitimYeri: response.egitimYeri ?? undefined,
      sehirKodu: response.sehir?.kodu ?? undefined,
      kontenjan: response.kontenjan ?? undefined
    };
  }
}
