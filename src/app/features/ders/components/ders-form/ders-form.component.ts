import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DersRequest } from 'src/app/core/models/ders-request';
import { DersResponse } from 'src/app/core/models/ders-response';
import { DersTuru } from 'src/app/core/models/ders-turu';
import { DersTuruService } from 'src/app/core/services/api/ders-turu.service';
import { CommonModule } from '@angular/common';
import { DersSeviyesi } from 'src/app/core/models/ders-seviyesi';
import { DersSeviyesiService } from 'src/app/core/services/api/ders-seviyesi.service';
import { DersNiteligi } from 'src/app/core/models/ders-niteligi';
import { DersNiteligiService } from 'src/app/core/services/api/ders-niteligi.service';
import { HedefKitleEgitimSeviyesiResponse } from 'src/app/core/models/hedef-kitle-egitim-seviyesi-response';
import { HedefKitleEgitimSeviyesiService } from 'src/app/core/services/api/hedef-kitle-egitim-seviyesi.service';

@Component({
  selector: 'app-ders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ders-form.component.html',
  styleUrl: './ders-form.component.css'
})
export class DersFormComponent implements OnInit {
  @Input() initialData?: DersResponse;
  @Output() save = new EventEmitter<DersRequest>();

  form: FormGroup;
  dersTurleri: DersTuru[] = [];
  loadingDersTuru = false;

  dersSeviyeleri: DersSeviyesi[] = [];
  loadingDersSeviyesi = false;

  dersNitelikleri: DersNiteligi[] = [];
  loadingDersNiteligi = false;
  hedefKitleEgitimSeviyeleri: HedefKitleEgitimSeviyesiResponse[] = [];
  loadingHedefKitleEgitimSeviyesi = false;

  constructor(
    private fb: FormBuilder,
    private dersTuruService: DersTuruService,
    private dersSeviyesiService: DersSeviyesiService,
    private dersNiteligiService: DersNiteligiService,
    private hedefKitleEgitimSeviyesiService: HedefKitleEgitimSeviyesiService
  ) {
    this.form = this.fb.group({
      adi: ['', Validators.required],
      amaci: [''],
      turuKodu: ['', Validators.required],
      seviyesiKodu: ['', Validators.required],
      niteligiKodu: ['', Validators.required],
      tahminiDersSuresi: [''],
      dersOzeti: [''],
      onayDurumu: [''],
      hedefKitleEgitimSeviyeKodu: [''],
      ilgiAlaninaGoreHedefKitle: [''],
      kullanilacakProgramlar: [''],
      kazanimlar: [''],
      sikcaSorulanSorular: ['']
    });
  }

  ngOnInit() {
    this.loadDersTurleri();
    this.loadDersSeviyeleri();
    this.loadDersNitelikleri();
    this.loadHedefKitleEgitimSeviyeleri();

    if (this.initialData) {
      this.form.patchValue({
        adi: this.initialData.adi,
        amaci: this.initialData.amaci,
        turuKodu: this.initialData.turu?.kodu,
        seviyesiKodu: this.initialData.seviyesi?.kodu,
        niteligiKodu: this.initialData.niteligi?.kodu,
        tahminiDersSuresi: this.initialData.tahminiDersSuresi,
        dersOzeti: this.initialData.dersOzeti,
        onayDurumu: this.initialData.onayDurumu,
        hedefKitleEgitimSeviyeKodu: this.initialData.hedefKitleEgitimSeviye !== undefined && this.initialData.hedefKitleEgitimSeviye !== null
          ? String(this.initialData.hedefKitleEgitimSeviye)
          : undefined,
        ilgiAlaninaGoreHedefKitle: this.initialData.ilgiAlaninaGoreHedefKitle,
        kullanilacakProgramlar: this.initialData.kullanilacakProgramlar,
        kazanimlar: this.initialData.kazanimlar,
        sikcaSorulanSorular: this.initialData.sikcaSorulanSorular
      });
    }
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

  private loadHedefKitleEgitimSeviyeleri() {
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

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value as DersRequest);
    }
  }
}
