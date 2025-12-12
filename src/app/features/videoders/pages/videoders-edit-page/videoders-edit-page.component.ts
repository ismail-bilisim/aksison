import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDersRequest } from 'src/app/core/models/videoders-request';
import { VideoDersResponse } from 'src/app/core/models/videoders-response';
import { VideodersFormComponent } from "src/app/features/videoders/components/videoders-form/videoders-form.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videoders-edit-page',
  imports: [VideodersFormComponent, RouterLink],
  templateUrl: './videoders-edit-page.component.html',
  styleUrl: './videoders-edit-page.component.css'
})

export class VideodersEditPageComponent implements OnInit, OnDestroy {
  videodersRequest?: VideoDersRequest;
  videodersResponse?: VideoDersResponse;
  isEditMode = false;
  private routeSub?: Subscription;
  private currentId?: number;

  constructor(
    private route: ActivatedRoute,
    private service: VideodersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.isEditMode = !!idParam;
      this.currentId = idParam ? Number(idParam) : undefined;

      console.log('Edit Modu:', this.isEditMode, 'ID:', this.currentId);

      if (this.isEditMode && this.currentId) {
        this.loadVideoders(this.currentId);
      } else {
        this.videodersResponse = undefined;
        this.videodersRequest = undefined;
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  onSave(payload: VideoDersRequest) {
    // Version değerini ekle: create için 1, update için mevcut response'dan
    const requestWithVersion: VideoDersRequest = {
      ...payload,
      version: this.isEditMode && this.videodersResponse 
        ? this.videodersResponse.version 
        : 1
    };

    if (this.isEditMode && this.currentId) {
      this.service.update(this.currentId, requestWithVersion).subscribe(() => this.router.navigate(['/videoders']));
    } else {
      this.service.create(requestWithVersion).subscribe(() => this.router.navigate(['/videoders']));
    }
  }

  private loadVideoders(id: number) {
    this.service.getById(id).subscribe({
      next: (response) => {
        this.videodersResponse = response;
        console.log('Yüklenen VideoDersResponse:', response);
        this.videodersRequest = this.mapResponseToRequest(response);
        console.log('Dönüştürülen VideoDersRequest:', this.videodersRequest);
      },
      error: () => this.router.navigate(['/videoders'])
    });
  }

  private mapResponseToRequest(response: VideoDersResponse): VideoDersRequest {
    return {
      adi: response.adi,
      version: response.version, // Backend'den gelen version değerini koru
      tahminiDersSuresi: response.tahminiDersSuresi,
      tahminiDersTeslimTarihi: response.tahminiDersTeslimTarihi ?? undefined,
      baslamaTarihi: response.baslamaTarihi ?? undefined,
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
      durumKodu: response.dersDurumu?.kodu ?? undefined,
      dersId: response.ders?.id ?? undefined
    };
  }
}
