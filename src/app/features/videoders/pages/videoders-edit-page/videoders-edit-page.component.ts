import { Component, DestroyRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDersRequest } from 'src/app/core/models/videoders-request';
import { VideoDersResponse } from 'src/app/core/models/videoders-response';
import { VideodersFormComponent } from "src/app/features/videoders/components/videoders-form/videoders-form.component";
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LookupService } from 'src/app/core/services/api/lookup.service';
import { VideodersLookupData } from 'src/app/core/models/videoders-lookup-data';
import { DersService } from 'src/app/core/services/api/ders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videoders-edit-page',
  imports: [VideodersFormComponent, RouterLink, CommonModule],
  templateUrl: './videoders-edit-page.component.html',
  styleUrl: './videoders-edit-page.component.css'
})

export class VideodersEditPageComponent implements OnInit, OnDestroy {
  // Signals for reactive state management (Angular 19)
  videodersResponse = signal<VideoDersResponse | undefined>(undefined);
  videodersRequest = signal<VideoDersRequest | undefined>(undefined);
  lookupData = signal<VideodersLookupData | undefined>(undefined);
  isLoadingLookups = signal<boolean>(false);
  isLoadingDersDetay = signal<boolean>(false);

  isEditMode = false;
  private routeSub?: Subscription;
  private currentId?: number;
  
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly videodersService = inject(VideodersService);
  private readonly lookupService = inject(LookupService);
  private readonly dersService = inject(DersService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  ngOnInit() {
    // Lookup verilerini yükle (cache'li, tek seferlik)
    this.loadLookupData();

    // Route parametrelerini dinle
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.isEditMode = !!idParam;
      this.currentId = idParam ? Number(idParam) : undefined;

      console.log('Edit Modu:', this.isEditMode, 'ID:', this.currentId);

      if (this.isEditMode && this.currentId) {
        this.loadVideoders(this.currentId);
      } else {
        this.videodersResponse.set(undefined);
        this.videodersRequest.set(undefined);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  /**
   * Lookup verilerini yükle (cache'li servis sayesinde tek seferlik)
   */
  private loadLookupData() {
    this.isLoadingLookups.set(true);
    this.lookupService.getVideodersLookups()
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
  onDersSelected(dersId: number) {
    this.isLoadingDersDetay.set(true);
    this.dersService.getById(dersId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ders) => {
          console.log('Yüklenen Ders detayı:', ders);
          
          // Mevcut form değerlerini al
          const currentRequest = this.videodersRequest();
          
          // Ders detayından patch yapılacak alanları hazırla
          const patch: Partial<VideoDersRequest> = {
            ...currentRequest,
            adi: ders.adi,
            amaci: ders.amaci ?? currentRequest?.amaci,
            dersOzeti: ders.dersOzeti ?? currentRequest?.dersOzeti,
            turuKodu: ders.turu?.kodu ?? currentRequest?.turuKodu,
            seviyesiKodu: ders.seviyesi?.kodu ?? currentRequest?.seviyesiKodu,
            niteligiKodu: ders.niteligi?.kodu ?? currentRequest?.niteligiKodu,
            hedefKitleEgitimSeviyeKodu: ders.hedefKitleEgitimSeviye !== undefined 
              ? String(ders.hedefKitleEgitimSeviye) 
              : currentRequest?.hedefKitleEgitimSeviyeKodu,
            ilgiAlaninaGoreHedefKitle: ders.ilgiAlaninaGoreHedefKitle ?? currentRequest?.ilgiAlaninaGoreHedefKitle,
            kullanilacakProgramlar: ders.kullanilacakProgramlar ?? currentRequest?.kullanilacakProgramlar,
            kazanimlar: ders.kazanimlar ?? currentRequest?.kazanimlar,
            sikcaSorulanSorular: ders.sikcaSorulanSorular ?? currentRequest?.sikcaSorulanSorular
          };

          this.videodersRequest.set(patch as VideoDersRequest);
          this.isLoadingDersDetay.set(false);
        },
        error: (error) => {
          console.error('Ders detayı yüklenirken hata oluştu:', error);
          this.toastService.error('Ders detayı yüklenirken hata oluştu.');
          this.isLoadingDersDetay.set(false);
        }
      });
  }

  onSave(payload: VideoDersRequest) {
    // Version değerini ekle: create için 1, update için mevcut response'dan
    const requestWithVersion: VideoDersRequest = {
      ...payload,
      version: this.isEditMode && this.videodersResponse() 
        ? this.videodersResponse()!.version 
        : 1
    };

    if (this.isEditMode && this.currentId) {
      this.videodersService.update(this.currentId, requestWithVersion)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.toastService.success('Video ders başarıyla güncellendi.');
            this.router.navigate(['/videoders', this.currentId]);
          },
          error: (error) => {
            console.error('Video ders güncellenirken hata oluştu:', error);
            this.toastService.error('Video ders güncellenirken hata oluştu.');
          }
        });
    } else {
      this.videodersService.create(requestWithVersion)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.toastService.success('Video ders başarıyla oluşturuldu.');
            this.router.navigate(['/videoders', response.id]);
          },
          error: (error) => {
            console.error('Video ders oluşturulurken hata oluştu:', error);
            this.toastService.error('Video ders oluşturulurken hata oluştu.');
          }
        });
    }
  }

  private loadVideoders(id: number) {
    this.videodersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.videodersResponse.set(response);
          console.log('Yüklenen VideoDersResponse:', response);
          this.videodersRequest.set(this.mapResponseToRequest(response));
          console.log('Dönüştürülen VideoDersRequest:', this.videodersRequest());
        },
        error: (error) => {
          console.error('Video ders yüklenirken hata oluştu:', error);
          this.toastService.error('Video ders yüklenirken hata oluştu.');
          this.router.navigate(['/videoders']);
        }
      });
  }

  private mapResponseToRequest(response: VideoDersResponse): VideoDersRequest {
    return {
      adi: response.adi,
      version: response.version, // Backend'den gelen version değerini koru
      tahminiDersSuresi: response.tahminiDersSuresi,
      tahminiDersTeslimTarihi: response.tahminiDersTeslimTarihi ?? undefined,
      dersTeslimTarihi: response.dersTeslimTarihi ?? undefined,
      amaci: response.amaci ?? undefined,
      turuKodu: response.turu?.kodu ?? undefined,
      seviyesiKodu: response.seviyesi?.kodu ?? undefined,
      niteligiKodu: response.niteligi?.kodu ?? undefined,
      hedefKitleEgitimSeviyeKodu: response.hedefKitleEgitimSeviye?.kodu ?? undefined,
      ilgiAlaninaGoreHedefKitle: response.ilgiAlaninaGoreHedefKitle ?? undefined,
      kullanilacakProgramlar: response.kullanilacakProgramlar ?? undefined,
      kazanimlar: response.kazanimlar ?? undefined,
      sikcaSorulanSorular: response.sikcaSorulanSorular ?? undefined,
      dersOzeti: response.dersOzeti ?? undefined,
      dersCekimYontemKodu: response.dersCekimYontemi?.kodu ?? undefined,
      portalAdresi: response.portalAdresi ?? undefined,
      onayDurumu: response.onayDurumu ?? undefined,
      odemeKaynakKodu: response.odemeKaynak?.kodu ?? undefined,
      birimUcret: response.birimUcret ?? undefined,
      toplamUcret: response.toplamUcret ?? undefined,
      // durumKodu removed
      dersId: response.ders?.id ?? undefined
    };
  }
}
