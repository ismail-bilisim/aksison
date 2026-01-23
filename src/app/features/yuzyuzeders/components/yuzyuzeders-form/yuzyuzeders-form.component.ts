import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { YuzyuzeDersRequest } from 'src/app/core/models/yuzyuzeders-request';
import { DersTuru } from 'src/app/core/models/ders-turu';
import { DersSeviyesi } from 'src/app/core/models/ders-seviyesi';
import { DersNiteligi } from 'src/app/core/models/ders-niteligi';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { DersTuruService } from 'src/app/core/services/api/ders-turu.service';
import { DersSeviyesiService } from 'src/app/core/services/api/ders-seviyesi.service';
import { DersNiteligiService } from 'src/app/core/services/api/ders-niteligi.service';
import { DersService } from 'src/app/core/services/api/ders.service';
import { HedefKitleEgitimSeviyesiService } from 'src/app/core/services/api/hedef-kitle-egitim-seviyesi.service';
import { HedefKitleEgitimSeviyesiResponse } from 'src/app/core/models/hedef-kitle-egitim-seviyesi-response';
import { OdemeKaynak } from 'src/app/core/models/odeme-kaynak';
import { OdemeKaynakService } from 'src/app/core/services/api/odeme-kaynak.service';

@Component({
  selector: 'app-yuzyuzeders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './yuzyuzeders-form.component.html',
  styleUrls: ['./yuzyuzeders-form.component.css']
})
export class YuzyuzedersFormComponent implements OnInit, OnChanges {
  @Input() initialData?: YuzyuzeDersRequest;
  @Output() save = new EventEmitter<YuzyuzeDersRequest>();

  form: FormGroup;
  
  dersler: DersOzet[] = [];
  loadingDers = false;

  dersTurleri: DersTuru[] = [];
  loadingDersTuru = false;

  dersSeviyeleri: DersSeviyesi[] = [];
  loadingDersSeviyesi = false;

  dersNitelikleri: DersNiteligi[] = [];
  loadingDersNiteligi = false;

  hedefKitleEgitimSeviyeleri: HedefKitleEgitimSeviyesiResponse[] = [];
  loadingHedefKitleEgitimSeviyesi = false;

  odemeKaynaklari: OdemeKaynak[] = [];
  loadingOdemeKaynak = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dersService: DersService,
    private readonly dersTuruService: DersTuruService,
    private readonly dersSeviyesiService: DersSeviyesiService,
    private readonly dersNiteligiService: DersNiteligiService,
    private readonly hedefKitleEgitimSeviyesiService: HedefKitleEgitimSeviyesiService,
    private readonly odemeKaynakService: OdemeKaynakService
  ) {
    this.form = this.fb.group({
      dersKodu: ['', Validators.required],
      adi: ['', Validators.required],
      amaci: [''],
      dersOzeti: [''],
      turuKodu: [''],
      seviyesiKodu: [''],
      niteligiKodu: [''],
      hedefKitleEgitimSeviyeKodu: [''],
      ilgiAlaninaGoreHedefKitle: [''],
      kullanilacakProgramlar: [''],
      kazanimlar: [''],
      sikcaSorulanSorular: [''],
      dersSuresi: [''],
      baslamaTarihi: [''],
      bitisTarihi: [''],
      egitimYeri: [''],
      sehir: [''],
      kontenjan: [''],
      odemeKaynak: [''],
      birimUcret: [''],
      toplamUcret: ['']
    });
  }

  ngOnInit(): void {
    this.loadLookupData();

    this.form.get('dersKodu')?.valueChanges.subscribe(dersId => {
      if (dersId) {
        this.loadDersDetay(dersId);
      }
    });

    this.patchForm(this.initialData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']?.currentValue) {
      this.patchForm(changes['initialData'].currentValue);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  private patchForm(data?: YuzyuzeDersRequest): void {
    if (!data) return;
    this.form.patchValue(data, { emitEvent: false });
  }

  private loadLookupData(): void {
    this.loadDersler();
    this.loadDersTurleri();
    this.loadDersSeviyeleri();
    this.loadDersNitelikleri();
    this.loadHedefKitleEgitimSeviyeleri();
    this.loadOdemeKaynaklari();
  }

  private loadDersler(): void {
    this.loadingDers = true;
    this.dersService.getAllOzet().subscribe({
      next: (data) => {
        this.dersler = data;
        this.loadingDers = false;
      },
      error: (err) => {
        console.error('Dersler yüklenemedi:', err);
        this.loadingDers = false;
      }
    });
  }

  private loadDersTurleri(): void {
    this.loadingDersTuru = true;
    this.dersTuruService.getAll().subscribe({
      next: (data) => {
        this.dersTurleri = data;
        this.loadingDersTuru = false;
      },
      error: (err) => {
        console.error('Ders türleri yüklenemedi:', err);
        this.loadingDersTuru = false;
      }
    });
  }

  private loadDersSeviyeleri(): void {
    this.loadingDersSeviyesi = true;
    this.dersSeviyesiService.getAll().subscribe({
      next: (data) => {
        this.dersSeviyeleri = data;
        this.loadingDersSeviyesi = false;
      },
      error: (err) => {
        console.error('Ders seviyeleri yüklenemedi:', err);
        this.loadingDersSeviyesi = false;
      }
    });
  }

  private loadDersNitelikleri(): void {
    this.loadingDersNiteligi = true;
    this.dersNiteligiService.getAll().subscribe({
      next: (data) => {
        this.dersNitelikleri = data;
        this.loadingDersNiteligi = false;
      },
      error: (err) => {
        console.error('Ders nitelikleri yüklenemedi:', err);
        this.loadingDersNiteligi = false;
      }
    });
  }

  private loadHedefKitleEgitimSeviyeleri(): void {
    this.loadingHedefKitleEgitimSeviyesi = true;
    this.hedefKitleEgitimSeviyesiService.getAll().subscribe({
      next: (data) => {
        this.hedefKitleEgitimSeviyeleri = data;
        this.loadingHedefKitleEgitimSeviyesi = false;
      },
      error: (err) => {
        console.error('Hedef kitle eğitim seviyeleri yüklenemedi:', err);
        this.loadingHedefKitleEgitimSeviyesi = false;
      }
    });
  }

  private loadOdemeKaynaklari(): void {
    this.loadingOdemeKaynak = true;
    this.odemeKaynakService.getAll().subscribe({
      next: (data) => {
        this.odemeKaynaklari = data;
        this.loadingOdemeKaynak = false;
      },
      error: (err) => {
        console.error('Ödeme kaynakları yüklenemedi:', err);
        this.loadingOdemeKaynak = false;
      }
    });
  }

  private loadDersDetay(dersId: number): void {
    this.dersService.getById(dersId).subscribe({
      next: (ders) => {
        const patch: Partial<YuzyuzeDersRequest> = {};

        if (ders.adi) patch.adi = ders.adi;
        if (ders.amaci) patch.amaci = ders.amaci;
        if (ders.dersOzeti) patch.dersOzeti = ders.dersOzeti;
        if (ders.turu?.kodu) patch.turuKodu = ders.turu.kodu;
        if (ders.seviyesi?.kodu) patch.seviyesiKodu = ders.seviyesi.kodu;
        if (ders.niteligi?.kodu) patch.niteligiKodu = ders.niteligi.kodu;
        if (ders.hedefKitleEgitimSeviye?.kodu !== undefined) {
          patch.hedefKitleEgitimSeviyeKodu = String(ders.hedefKitleEgitimSeviye.kodu);
        }
        if (ders.ilgiAlaninaGoreHedefKitle) {
          patch.ilgiAlaninaGoreHedefKitle = ders.ilgiAlaninaGoreHedefKitle;
        }
        if (ders.kullanilacakProgramlar) {
          patch.kullanilacakProgramlar = ders.kullanilacakProgramlar;
        }
        if (ders.kazanimlar) patch.kazanimlar = ders.kazanimlar;
        if (ders.sikcaSorulanSorular) patch.sikcaSorulanSorular = ders.sikcaSorulanSorular;
        if (ders.odemeKaynak?.kodu) patch.odemeKaynak = ders.odemeKaynak.kodu;

        if (Object.keys(patch).length) {
          this.form.patchValue(patch);
        }
      },
      error: (err) => {
        console.error('Ders detayı yüklenemedi:', err);
      }
    });
  }
}
