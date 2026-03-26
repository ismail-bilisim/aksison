import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EtkinlikOrganizasyonRequest } from 'src/app/core/models/etkinlik-organizasyon-request';
import { EtkinlikTuruOzet } from 'src/app/core/models/etkinlik-turu-ozet';
import { EtkinlikTemaOzet } from 'src/app/core/models/etkinlik-tema-ozet';
import { SehirOzet } from 'src/app/core/models/sehir-ozet';

export interface EtkinlikFormLookupData {
  turler: EtkinlikTuruOzet[];
  temalar: EtkinlikTemaOzet[];
  sehirler: SehirOzet[];
}

@Component({
  selector: 'app-etkinlikorganizasyon-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './etkinlikorganizasyon-form.component.html'
})
export class EtkinlikOrganizasyonFormComponent implements OnInit, OnChanges {
  @Input() initialData?: EtkinlikOrganizasyonRequest;
  @Input() lookupData?: EtkinlikFormLookupData;
  @Input() isEditMode = false;

  @Output() save = new EventEmitter<EtkinlikOrganizasyonRequest>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  constructor() {
    this.form = this.fb.group({
      adi: ['', Validators.required],
      amaci: [''],
      aciklama: [''],
      turuKodu: ['', Validators.required],
      temaKodu: [''],
      hedefKitle: [''],
      kazanimlar: [''],
      sikcaSorulanSorular: [''],
      davetliler: [''],
      sartlarKurallar: [''],
      suresi: [null],
      baslamaTarihi: [''],
      bitisTarihi: [''],
      yeri: [''],
      basvuruTarihi: [''],
      basvuruBitisTarihi: [''],
      sehirKodu: [''],
      kontenjan: [null]
    });
  }

  ngOnInit(): void {
    this.patchForm(this.initialData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']?.currentValue) {
      this.patchForm(changes['initialData'].currentValue);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as EtkinlikOrganizasyonRequest);
    }
  }

  private patchForm(data?: EtkinlikOrganizasyonRequest): void {
    if (!data) return;
    this.form.patchValue(data, { emitEvent: false });
  }
}
