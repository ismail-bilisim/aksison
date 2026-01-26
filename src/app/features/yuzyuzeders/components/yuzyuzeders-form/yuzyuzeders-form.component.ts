import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { YuzyuzeDersRequest } from 'src/app/core/models/yuzyuzeders-request';
import { YuzyuzedersLookupData } from 'src/app/core/models/yuzyuzeders-lookup-data';
import { DersService } from 'src/app/core/services/api/ders.service';

@Component({
  selector: 'app-yuzyuzeders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './yuzyuzeders-form.component.html',
  styleUrls: ['./yuzyuzeders-form.component.css']
})
export class YuzyuzedersFormComponent implements OnInit, OnChanges {
  @Input() initialData?: YuzyuzeDersRequest;
  @Input() lookupData?: YuzyuzedersLookupData;
  @Input() isEditMode = false;
  
  @Output() save = new EventEmitter<YuzyuzeDersRequest>();
  @Output() dersSelected = new EventEmitter<number>();

  private fb = inject(FormBuilder);
  private dersService = inject(DersService);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      dersId: ['', Validators.required],
      adi: ['', Validators.required],
      amaci: ['', Validators.required],
      dersOzeti: ['', Validators.required],
      turuKodu: ['', Validators.required],
      seviyesiKodu: ['', Validators.required],
      niteligiKodu: ['', Validators.required],
      hedefKitleEgitimSeviyeKodu: ['', Validators.required],
      ilgiAlaninaGoreHedefKitle: [''],
      kullanilacakProgramlar: ['', Validators.required],
      kazanimlar: ['', Validators.required],
      sikcaSorulanSorular: [''],
      dersSuresi: [''],
      baslamaTarihi: ['', Validators.required],
      bitisTarihi: ['', Validators.required],
      egitimYeri: ['', Validators.required],
      sehirKodu: ['', Validators.required],
      kontenjan: [''],
      odemeKaynakKodu: ['', Validators.required],
      birimUcret: [''],
      toplamUcret: ['']
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
      console.log('ngOnChanges initialData:', changes['initialData'].currentValue);
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
    console.log('patchForm data:', data);
    console.log('Form value before patch:', this.form.value);
    this.form.patchValue(data, { emitEvent: false });
    console.log('Form value after patch:', this.form.value);
  }

}
