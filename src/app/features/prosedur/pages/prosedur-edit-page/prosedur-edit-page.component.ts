import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { ProsedurService } from 'src/app/core/services/api/prosedur.service';
import { ProsedurRequest } from 'src/app/core/models/prosedur-request';
import { ProsedurResponse } from 'src/app/core/models/prosedur-response';
import { ProsedurFormComponent, ProsedurFormLookupData } from '../../components/prosedur-form/prosedur-form.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { LookupService } from 'src/app/core/services/api/lookup.service';

@Component({
  selector: 'app-prosedur-edit-page',
  standalone: true,
  imports: [ProsedurFormComponent, RouterLink, CommonModule],
  templateUrl: './prosedur-edit-page.component.html'
})
export class ProsedurEditPageComponent implements OnInit {
  prosedurResponse = signal<ProsedurResponse | undefined>(undefined);
  prosedurRequest = signal<ProsedurRequest | undefined>(undefined);
  lookupData = signal<ProsedurFormLookupData | undefined>(undefined);
  isLoadingLookups = signal<boolean>(false);

  isEditMode = false;

  private currentId = 0;

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly prosedurService = inject(ProsedurService);
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
          this.loadProsedur(this.currentId);
        } else {
          this.prosedurResponse.set(undefined);
          this.prosedurRequest.set(undefined);
        }
      });
  }

  private loadLookupData(): void {
    this.isLoadingLookups.set(true);
    this.lookupService.getProsedurLookups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.lookupData.set({
            surecTurleri: data.surecTurleri
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

  onSave(payload: ProsedurRequest): void {
    const requestWithVersion: ProsedurRequest = {
      ...payload,
      version: this.isEditMode && this.prosedurResponse()
        ? this.prosedurResponse()!.version
        : 1
    };
    if (this.isEditMode && this.currentId) {
      this.updateProsedur(requestWithVersion);
    } else {
      this.createProsedur(requestWithVersion);
    }
  }

  private createProsedur(request: ProsedurRequest): void {
    this.prosedurService.create(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.toastService.success('Prosedür başarıyla oluşturuldu.');
          this.router.navigate(['/prosedur/detail', response.id]);
        },
        error: (error) => {
          console.error('Prosedür oluşturulurken hata oluştu:', error);
          this.toastService.error('Prosedür oluşturulurken hata oluştu.');
        }
      });
  }

  private updateProsedur(request: ProsedurRequest): void {
    this.prosedurService.update(this.currentId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Prosedür başarıyla güncellendi.');
          this.router.navigate(['/prosedur/detail', this.currentId]);
        },
        error: (error) => {
          console.error('Prosedür güncellenirken hata oluştu:', error);
          this.toastService.error('Prosedür güncellenirken hata oluştu.');
        }
      });
  }

  private loadProsedur(id: number): void {
    this.prosedurService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.prosedurResponse.set(response);
          this.prosedurRequest.set(this.mapResponseToRequest(response));
        },
        error: (error) => {
          console.error('Prosedür yüklenirken hata oluştu:', error);
          this.toastService.error('Prosedür yüklenirken hata oluştu.');
          this.router.navigate(['/prosedur']);
        }
      });
  }

  private mapResponseToRequest(response: ProsedurResponse): ProsedurRequest {
    return {
      adi: response.adi,
      version: response.version,
      amac: response.amac ?? undefined,
      kapsam: response.kapsam ?? undefined,
      surecTuruKodu: response.surecTuru?.kodu ?? undefined
    };
  }
}
