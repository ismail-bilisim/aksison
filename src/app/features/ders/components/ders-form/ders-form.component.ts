import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DersRequest } from 'src/app/core/models/ders-request';
import { DersResponse } from 'src/app/core/models/ders-response';
import { debounceTime, startWith } from 'rxjs';
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
  @Input() isSaving = false;
  @Output() save = new EventEmitter<DersRequest>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formDirtyChange = new EventEmitter<boolean>();

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
    private readonly fb: FormBuilder,
    private readonly dersTuruService: DersTuruService,
    private readonly dersSeviyesiService: DersSeviyesiService,
    private readonly dersNiteligiService: DersNiteligiService,
    private readonly hedefKitleEgitimSeviyesiService: HedefKitleEgitimSeviyesiService
  ) {
    this.form = this.fb.group({
      adi: ['', Validators.required],
      amaci: ['', Validators.required],
      turuKodu: ['', Validators.required],
      seviyesiKodu: ['', Validators.required],
      niteligiKodu: ['', Validators.required],
      tahminiDersSuresi: ['', Validators.required],
      dersOzeti: ['', Validators.required],
      onayDurumu: [''],
      hedefKitleEgitimSeviyeKodu: ['', Validators.required],
      ilgiAlaninaGoreHedefKitle: ['', Validators.required],
      kullanilacakProgramlar: [''],
      kazanimlar: ['', Validators.required],
      sikcaSorulanSorular: ['']
    });
  }

  ngOnInit() {
    this.loadDersTurleri();
    this.loadDersSeviyeleri();
    this.loadDersNitelikleri();
    this.loadHedefKitleEgitimSeviyeleri();

    // Track form dirty state and emit changes
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      debounceTime(100)
    ).subscribe(() => {
      this.formDirtyChange.emit(this.form.dirty);
    });

    if (this.initialData) {
      console.log("inital ders Data:", this.initialData);
      this.form.patchValue({
        adi: this.initialData.adi,
        amaci: this.initialData.amaci,
        turuKodu: this.initialData.turu?.kodu,
        seviyesiKodu: this.initialData.seviyesi?.kodu,
        niteligiKodu: this.initialData.niteligi?.kodu,
        tahminiDersSuresi: this.initialData.tahminiDersSuresi,
        dersOzeti: this.initialData.dersOzeti,
        onayDurumu: this.initialData.onayDurumu,
        hedefKitleEgitimSeviyeKodu: this.initialData.hedefKitleEgitimSeviye?.kodu,
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

  onCancel() {
    this.formCancel.emit();
  }
}
