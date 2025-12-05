import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ders } from 'src/app/core/models/ders';
import { DersTuru } from 'src/app/core/models/ders-turu';
import { DersTuruService } from 'src/app/core/services/api/ders-turu.service';
import { CommonModule } from '@angular/common';
import { DersSeviyesi } from 'src/app/core/models/ders-seviyesi';
import { DersSeviyesiService } from 'src/app/core/services/api/ders-seviyesi.service';
import { DersNiteligi } from 'src/app/core/models/ders-niteligi';
import { DersNiteligiService } from 'src/app/core/services/api/ders-niteligi.service';

@Component({
  selector: 'app-ders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ders-form.component.html',
  styleUrl: './ders-form.component.css'
})
export class DersFormComponent implements OnInit {
  @Input() initialData?: Ders;
  @Output() save = new EventEmitter<Ders>();

  form: FormGroup;
  dersTurleri: DersTuru[] = [];
  loadingDersTuru = false;

  dersSeviyeleri: DersSeviyesi[] = [];
  loadingDersSeviyesi = false;

  dersNitelikleri: DersNiteligi[] = [];
  loadingDersNiteligi = false;

  constructor(
    private fb: FormBuilder,
    private dersTuruService: DersTuruService,
    private dersSeviyesiService: DersSeviyesiService,
    private dersNiteligiService: DersNiteligiService
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
      hedefKitleEgitimSeviye: [''],
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

    if (this.initialData) {
      this.form.patchValue(this.initialData);
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

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
