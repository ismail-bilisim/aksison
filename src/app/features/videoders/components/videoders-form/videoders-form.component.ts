import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { VideoDersRequest } from 'src/app/core/models/videoders-request';
import { DersTuru } from 'src/app/core/models/ders-turu';
import { DersSeviyesi } from 'src/app/core/models/ders-seviyesi';
import { DersNiteligi } from 'src/app/core/models/ders-niteligi';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { DersTuruService } from 'src/app/core/services/api/ders-turu.service';
import { DersSeviyesiService } from 'src/app/core/services/api/ders-seviyesi.service';
import { DersNiteligiService } from 'src/app/core/services/api/ders-niteligi.service';
import { DersService } from 'src/app/core/services/api/ders.service';

@Component({
  selector: 'app-videoders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './videoders-form.component.html',
  styleUrl: './videoders-form.component.css'
})
export class VideodersFormComponent implements OnInit, OnChanges {
  @Input() initialData?: VideoDersRequest;
  @Output() save = new EventEmitter<VideoDersRequest>();

  form: FormGroup;
  dersler: DersOzet[] = [];
  loadingDers = false;

  dersTurleri: DersTuru[] = [];
  loadingDersTuru = false;

  dersSeviyeleri: DersSeviyesi[] = [];
  loadingDersSeviyesi = false;

  dersNitelikleri: DersNiteligi[] = [];
  loadingDersNiteligi = false;

  constructor(
    private fb: FormBuilder,
    private dersService: DersService,
    private dersTuruService: DersTuruService,
    private dersSeviyesiService: DersSeviyesiService,
    private dersNiteligiService: DersNiteligiService
  ) {
    this.form = this.fb.group({
      dersId: ['', Validators.required],
      adi: ['', Validators.required],
      tahminiDersSuresi: [''],
      tahminiDersTeslimTarihi: [''],
      baslamaTarihi: [''],
      amaci: [''],
      turuKodu: [''],
      seviyesiKodu: [''],
      niteligiKodu: [''],
      hedefKitleEgitimSeviye: [''],
      ilgiAlaninaGoreHedefKitle: [''],
      kullanilacakProgramlar: [''],
      kazanimlar: [''],
      sikcaSorulanSorular: [''],
      dersOzeti: [''],
      dersCekimYontemi: [''],
      portalAdresi: [''],
      odemeKaynak: [''],
      birimUcret: [''],
      toplamUcret: ['']
    });
  }

  ngOnInit() {
    this.loadDersler();
    this.loadDersTurleri();
    this.loadDersSeviyeleri();
    this.loadDersNitelikleri();

    this.form.get('dersId')?.valueChanges.subscribe(dersId => {
      if (dersId) {
        this.loadDersDetay(dersId);
      }
    });

    this.patchForm(this.initialData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && changes['initialData'].currentValue) {
      this.patchForm(changes['initialData'].currentValue);
    }
  }

  private patchForm(data?: VideoDersRequest) {
    if (!data) {
      return;
    }
    this.form.patchValue(data, { emitEvent: false });
  }

  private loadDersler() {
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

  private loadDersTurleri() {
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

  private loadDersSeviyeleri() {
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

  private loadDersNitelikleri() {
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

  private loadDersDetay(dersId: number) {
    this.dersService.getById(dersId).subscribe({
      next: (ders) => {
        const patch: Partial<VideoDersRequest> = {};

        console.log('Yüklenen Ders detayı:', ders);
        if (ders.adi) patch.adi = ders.adi;
        if (ders.amaci) patch.amaci = ders.amaci;
        if (ders.dersOzeti) patch.dersOzeti = ders.dersOzeti;
        const turuKodu = ders.turu?.kodu;
        if (turuKodu) patch.turuKodu = turuKodu;
        const seviyesiKodu = ders.seviyesi?.kodu;
        if (seviyesiKodu) patch.seviyesiKodu = seviyesiKodu;
        const niteligiKodu = ders.niteligi?.kodu;
        if (niteligiKodu) patch.niteligiKodu = niteligiKodu;
        if (ders.hedefKitleEgitimSeviye !== undefined) {
          patch.hedefKitleEgitimSeviye = ders.hedefKitleEgitimSeviye;
        }
        if (ders.ilgiAlaninaGoreHedefKitle) {
          patch.ilgiAlaninaGoreHedefKitle = ders.ilgiAlaninaGoreHedefKitle;
        }
        if (ders.kullanilacakProgramlar) {
          patch.kullanilacakProgramlar = ders.kullanilacakProgramlar;
        }
        if (ders.kazanimlar) {
          patch.kazanimlar = ders.kazanimlar;
        }
        if (ders.sikcaSorulanSorular) {
          patch.sikcaSorulanSorular = ders.sikcaSorulanSorular;
        }

        if (Object.keys(patch).length) {
          this.form.patchValue(patch);
        }
      },
      error: (err) => {
        console.error('Ders detayı yüklenemedi:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
