import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { VideoDersRequest } from 'src/app/core/models/videoders-request';
import { VideodersLookupData } from 'src/app/core/models/videoders-lookup-data';
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
  @Input() lookupData?: VideodersLookupData;
  @Input() isEditMode = false;
  
  @Output() save = new EventEmitter<VideoDersRequest>();
  @Output() dersSelected = new EventEmitter<number>();

  private fb = inject(FormBuilder);
  private dersService = inject(DersService);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      dersId: ['', Validators.required],
      adi: ['', Validators.required],
      tahminiDersSuresi: [''],
      tahminiDersTeslimTarihi: [''],
      amaci: ['', Validators.required],
      turuKodu: ['', Validators.required],
      seviyesiKodu: ['', Validators.required],
      niteligiKodu: ['', Validators.required],
      hedefKitleEgitimSeviyeKodu: ['', Validators.required],
      ilgiAlaninaGoreHedefKitle: [''],
      kullanilacakProgramlar: ['', Validators.required],
      kazanimlar: ['', Validators.required],
      sikcaSorulanSorular: [''],
      dersOzeti: ['', Validators.required],
      dersCekimYontemKodu: [''],
      portalAdresi: [''],
      odemeKaynakKodu: ['', Validators.required],
      birimUcret: [''],
      toplamUcret: ['']
    });
  }

  ngOnInit() {
    // dersId değişimini dinle ve parent'a bildir
    this.form.get('dersId')?.valueChanges.subscribe(dersId => {
      if (dersId) {
        this.dersSelected.emit(dersId);
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
    console.log('Patching form with data:', data);
    this.form.patchValue(data, { emitEvent: false });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
  
}
