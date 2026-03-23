import { Component, DestroyRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanlidersService } from 'src/app/core/services/api/canliders.service';
import { CanliDersRequest } from 'src/app/core/models/canliders-request';
import { CanliDersResponse } from 'src/app/core/models/canliders-response';
import { CanlidersFormComponent } from '../../components/canliders-form/canliders-form.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { LookupService } from 'src/app/core/services/api/lookup.service';
import { CanlidersLookupData } from 'src/app/core/models/canliders-lookup-data';
import { DersService } from 'src/app/core/services/api/ders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-canliders-edit-page',
  standalone: true,
  imports: [CanlidersFormComponent, RouterLink, CommonModule],
  templateUrl: './canliders-edit-page.component.html',
  styleUrls: ['./canliders-edit-page.component.css']
})
export class CanlidersEditPageComponent implements OnInit, OnDestroy {
  canlidersResponse = signal<CanliDersResponse | undefined>(undefined);
  canlidersRequest = signal<CanliDersRequest | undefined>(undefined);
  lookupData = signal<CanlidersLookupData | undefined>(undefined);
  isLoadingLookups = signal<boolean>(false);
  isLoadingDersDetay = signal<boolean>(false);
  
  isEditMode = false;
  
  private routeSub?: Subscription;
  private currentId?: number;
  
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly canlidersService = inject(CanlidersService);
  private readonly lookupService = inject(LookupService);
  private readonly dersService = inject(DersService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadLookupData();

    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.isEditMode = !!idParam;
      this.currentId = idParam ? Number(idParam) : undefined;

      if (this.isEditMode && this.currentId) {
        this.loadCanliders(this.currentId);
      } else {
        this.canlidersResponse.set(undefined);
        this.canlidersRequest.set(undefined);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private loadLookupData(): void {
    this.isLoadingLookups.set(true);
    this.lookupService.getCanlidersLookups()
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

  onDersSelected(dersId: number): void {
    this.isLoadingDersDetay.set(true);
    this.dersService.getById(dersId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ders) => {
          console.log('Yüklenen Ders detayı:', ders);
          
          const currentRequest = this.canlidersRequest();
          
          const patch: Partial<CanliDersRequest> = {
            ...currentRequest,
            adi: ders.adi,
            amaci: ders.amaci ?? currentRequest?.amaci,
            ozeti: ders.dersOzeti ?? currentRequest?.ozeti,
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

          this.canlidersRequest.set(patch as CanliDersRequest);
          this.isLoadingDersDetay.set(false);
        },
        error: (error) => {
          console.error('Ders detayı yüklenirken hata oluştu:', error);
          this.toastService.error('Ders detayı yüklenirken hata oluştu.');
          this.isLoadingDersDetay.set(false);
        }
      });
  }

  onSave(payload: CanliDersRequest): void {
    const requestWithVersion: CanliDersRequest = {
      ...payload,
      version: this.isEditMode && this.canlidersResponse() 
        ? this.canlidersResponse()!.version 
        : 1
    };

    if (this.isEditMode && this.currentId) {
      this.updateCanliders(requestWithVersion);
    } else {
      this.createCanliders(requestWithVersion);
    }
  }

  private createCanliders(request: CanliDersRequest): void {
    this.canlidersService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.toastService.success('Canlı ders başarıyla oluşturuldu.');
          this.router.navigate(['/canliders/detail', response.id]);
        },
        error: (error) => {
          console.error('Canlı ders oluşturulurken hata oluştu:', error);
          this.toastService.error('Canlı ders oluşturulurken hata oluştu.');
        }
      });
  }

  private updateCanliders(request: CanliDersRequest): void {
    this.canlidersService.update(this.currentId!, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Canlı ders başarıyla güncellendi.');
          this.router.navigate(['/canliders/detail', this.currentId]);
        },
        error: (error) => {
          console.error('Canlı ders güncellenirken hata oluştu:', error);
          this.toastService.error('Canlı ders güncellenirken hata oluştu.');
        }
      });
  }

  private loadCanliders(id: number): void {
    this.canlidersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.canlidersResponse.set(response);
          this.canlidersRequest.set(this.mapResponseToRequest(response));
          console.log('Yüklenen CanliDersResponse:', response);
        },
        error: (error) => {
          console.error('Canlı ders yüklenirken hata oluştu:', error);
          this.toastService.error('Canlı ders yüklenirken hata oluştu.');
          this.router.navigate(['/canliders']);
        }
      });
  }

  private mapResponseToRequest(response: CanliDersResponse): CanliDersRequest {
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
      ozeti: response.dersOzeti ?? undefined,
      suresi: response.dersSuresi ?? undefined,
      baglantiAdresi: response.baglantiAdresi ?? undefined,
      baslamaTarihi: response.baslamaTarihi ?? undefined,
      bitisTarihi: response.bitisTarihi ?? undefined,
      kontenjan: response.kontenjan ?? undefined,
      katilimSayisi: response.katilimSayisi ?? undefined
    };
  }
}
