import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { EtkinlikOrganizasyonService } from 'src/app/core/services/api/etkinlik-organizasyon.service';
import { EtkinlikOrganizasyonRequest } from 'src/app/core/models/etkinlik-organizasyon-request';
import { EtkinlikOrganizasyonResponse } from 'src/app/core/models/etkinlik-organizasyon-response';
import { EtkinlikOrganizasyonFormComponent, EtkinlikFormLookupData } from '../../components/etkinlikorganizasyon-form/etkinlikorganizasyon-form.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { LookupService } from 'src/app/core/services/api/lookup.service';

@Component({
  selector: 'app-etkinlikorganizasyon-edit-page',
  standalone: true,
  imports: [EtkinlikOrganizasyonFormComponent, RouterLink, CommonModule],
  templateUrl: './etkinlikorganizasyon-edit-page.component.html',
  styleUrls: ['./etkinlikorganizasyon-edit-page.component.css']
})
export class EtkinlikOrganizasyonEditPageComponent implements OnInit {
  etkinlikResponse = signal<EtkinlikOrganizasyonResponse | undefined>(undefined);
  etkinlikRequest = signal<EtkinlikOrganizasyonRequest | undefined>(undefined);
  lookupData = signal<EtkinlikFormLookupData | undefined>(undefined);
  isLoadingLookups = signal<boolean>(false);

  isEditMode = false;

  private currentId = 0;

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly etkinlikService = inject(EtkinlikOrganizasyonService);
  private readonly lookupService = inject(LookupService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadLookupData();

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const idParam = params.get('id');
        this.isEditMode = !!idParam;
        this.currentId = idParam ? Number(idParam) : 0;

        if (this.isEditMode && this.currentId) {
          this.loadEtkinlik(this.currentId);
        } else {
          this.etkinlikResponse.set(undefined);
          this.etkinlikRequest.set(undefined);
        }
      });
  }

  private loadLookupData(): void {
    this.isLoadingLookups.set(true);
    this.lookupService.getEtkinlikOrganizasyonLookups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.lookupData.set({
            turler: data.turler,
            temalar: data.temalar,
            sehirler: data.sehirler
          });
          this.isLoadingLookups.set(false);
        },
        error: (error) => {
          console.error('Lookup verileri yüklenirken hata oluştu:', error);
          this.toastService.error('Lookup verileri yüklenirken hata oluştu.');
          this.isLoadingLookups.set(false);
        }
      });
  }

  onSave(payload: EtkinlikOrganizasyonRequest): void {
    const requestWithVersion: EtkinlikOrganizasyonRequest = {
      ...payload,
      version: this.isEditMode && this.etkinlikResponse()
        ? this.etkinlikResponse()!.version
        : 1
    };
    if (this.isEditMode && this.currentId) {
      this.updateEtkinlik(requestWithVersion);
    } else {
      this.createEtkinlik(requestWithVersion);
    }
  }

  private createEtkinlik(request: EtkinlikOrganizasyonRequest): void {
    this.etkinlikService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.toastService.success('Etkinlik başarıyla oluşturuldu.');
          this.router.navigate(['/etkinlikorganizasyon/detail', response.id]);
        },
        error: (error) => {
          console.error('Etkinlik oluşturulurken hata oluştu:', error);
          this.toastService.error('Etkinlik oluşturulurken hata oluştu.');
        }
      });
  }

  private updateEtkinlik(request: EtkinlikOrganizasyonRequest): void {
    this.etkinlikService.update(this.currentId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Etkinlik başarıyla güncellendi.');
          this.router.navigate(['/etkinlikorganizasyon/detail', this.currentId]);
        },
        error: (error) => {
          console.error('Etkinlik güncellenirken hata oluştu:', error);
          this.toastService.error('Etkinlik güncellenirken hata oluştu.');
        }
      });
  }

  private loadEtkinlik(id: number): void {
    this.etkinlikService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.etkinlikResponse.set(response);
          this.etkinlikRequest.set(this.mapResponseToRequest(response));
        },
        error: (error) => {
          console.error('Etkinlik yüklenirken hata oluştu:', error);
          this.toastService.error('Etkinlik yüklenirken hata oluştu.');
          this.router.navigate(['/etkinlikorganizasyon']);
        }
      });
  }

  private mapResponseToRequest(response: EtkinlikOrganizasyonResponse): EtkinlikOrganizasyonRequest {
    return {
      adi: response.adi,
      version: response.version,
      amaci: response.amaci ?? undefined,
      aciklama: response.aciklama ?? undefined,
      turuKodu: response.turu?.kodu ?? undefined,
      temaKodu: response.tema?.kodu ?? undefined,
      hedefKitle: response.hedefKitle ?? undefined,
      kazanimlar: response.kazanimlar ?? undefined,
      sikcaSorulanSorular: response.sikcaSorulanSorular ?? undefined,
      davetliler: response.davetliler ?? undefined,
      sartlarKurallar: response.sartlarKurallar ?? undefined,
      suresi: response.suresi ?? undefined,
      baslamaTarihi: response.baslamaTarihi ?? undefined,
      bitisTarihi: response.bitisTarihi ?? undefined,
      yeri: response.yeri ?? undefined,
      basvuruTarihi: response.basvuruTarihi ?? undefined,
      basvuruBitisTarihi: response.basvuruBitisTarihi ?? undefined,
      sehirKodu: response.sehir?.kodu ?? undefined,
      kontenjan: response.kontenjan ?? undefined,
      etkinlikYoneticisiId: response.etkinlikYoneticisi?.id ?? undefined,
      grafikDuzenleyiciId: response.grafikDuzenleyici?.id ?? undefined,
      medyaSorumluId: response.medyaSorumlu?.id ?? undefined
    };
  }
}
