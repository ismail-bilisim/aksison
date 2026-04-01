import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CanliDersRequest } from 'src/app/core/models/canliders-request';
import { CanlidersLookupData } from 'src/app/core/models/canliders-lookup-data';
import { DersService } from 'src/app/core/services/api/ders.service';

@Component({
  selector: 'app-canliders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './canliders-form.component.html',
  styleUrls: ['./canliders-form.component.css']
})
export class CanlidersFormComponent implements OnInit, OnChanges {
  @Input() initialData?: CanliDersRequest;
  @Input() lookupData?: CanlidersLookupData;
  @Input() isEditMode = false;
  
  @Output() save = new EventEmitter<CanliDersRequest>();
  @Output() dersSelected = new EventEmitter<number>();

  private fb = inject(FormBuilder);
  private dersService = inject(DersService);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      dersId: ['', Validators.required],
      adi: ['', Validators.required],
      amaci: ['', Validators.required],
      turuKodu: ['', Validators.required],
      seviyesiKodu: ['', Validators.required],
      niteligiKodu: ['', Validators.required],
      hedefKitleEgitimSeviyeKodu: ['', Validators.required],
      ilgiAlaninaGoreHedefKitle: [''],
      kullanilacakProgramlar: ['', Validators.required],
      kazanimlar: ['', Validators.required],
      sikcaSorulanSorular: [''],
      sartlar: [''],
      suresi: [''],
      baslamaTarihi: ['', Validators.required],
      bitisTarihi: ['', Validators.required],
      baglantiAdresi: [''],
      kontenjan: [''],
      katilimSayisi: [''],
      ozeti: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // dersId değişimini dinle ve parent'a bildir
    this.form.get('dersId')?.valueChanges.subscribe(dersId => {
      if (dersId) {
        this.dersSelected.emit(dersId);
      }
    });

    this.patchForm(this.initialData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']?.currentValue) {
      this.patchForm(changes['initialData'].currentValue);
    }
  }

  get dersSuresiFormatli(): string {
    const dak = Number(this.form.get('suresi')?.value);
    if (!dak || isNaN(dak) || dak < 0) return '';
    const saat = Math.floor(dak / 60);
    const dakika = dak % 60;
    return `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}`;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  private patchForm(data?: CanliDersRequest): void {
    if (!data) return;
    this.form.patchValue(data, { emitEvent: false });
  }

}
