import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';
import { YuzyuzeDersRequest } from 'src/app/core/models/yuzyuzeders-request';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';
import { YuzyuzedersFormComponent } from '../../components/yuzyuzeders-form/yuzyuzeders-form.component';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-yuzyuzeders-edit-page',
  standalone: true,
  imports: [YuzyuzedersFormComponent, RouterLink],
  templateUrl: './yuzyuzeders-edit-page.component.html',
  styleUrls: ['./yuzyuzeders-edit-page.component.css']
})
export class YuzyuzedersEditPageComponent implements OnInit, OnDestroy {
  yuzyuzedersRequest?: YuzyuzeDersRequest;
  yuzyuzedersResponse?: YuzyuzeDersResponse;
  isEditMode = false;
  
  private routeSub?: Subscription;
  private currentId?: number;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: YuzyuzedersService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.isEditMode = !!idParam;
      this.currentId = idParam ? Number(idParam) : undefined;

      if (this.isEditMode && this.currentId) {
        this.loadYuzyuzeders(this.currentId);
      } else {
        this.yuzyuzedersResponse = undefined;
        this.yuzyuzedersRequest = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  onSave(payload: YuzyuzeDersRequest): void {
    const requestWithVersion: YuzyuzeDersRequest = {
      ...payload,
      version: this.isEditMode && this.yuzyuzedersResponse 
        ? this.yuzyuzedersResponse.version 
        : 1
    };

    if (this.isEditMode && this.currentId) {
      this.updateYuzyuzeders(requestWithVersion);
    } else {
      this.createYuzyuzeders(requestWithVersion);
    }
  }

  private createYuzyuzeders(request: YuzyuzeDersRequest): void {
    this.service.create(request)
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
    this.service.update(this.currentId!, request)
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
    this.service.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.yuzyuzedersResponse = response;
          this.yuzyuzedersRequest = this.mapResponseToRequest(response);
        },
        error: () => {
          this.toastService.error('Yüzyüze ders yüklenemedi.');
          this.router.navigate(['/yuzyuzeders']);
        }
      });
  }

  private mapResponseToRequest(response: YuzyuzeDersResponse): YuzyuzeDersRequest {
    return {
      adi: response.adi,
      version: response.version,
      dersKodu: response.ders?.id ?? undefined,
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
      dersSuresi: response.dersSuresi ?? undefined,
      baslamaTarihi: response.baslamaTarihi ?? undefined,
      bitisTarihi: response.bitisTarihi ?? undefined,
      egitimYeri: response.egitimYeri ?? undefined,
      sehir: response.sehir?.kodu ?? undefined,
      kontenjan: response.kontenjan ?? undefined,
      odemeKaynak: response.odemeKaynak?.kodu ?? undefined,
      birimUcret: response.birimUcret ?? undefined,
      toplamUcret: response.toplamUcret ?? undefined
    };
  }
}
