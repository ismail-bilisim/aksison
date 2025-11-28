import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { VideoDers } from 'src/app/core/models/videoders-detay';

@Component({
  selector: 'app-videoders-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './videoders-form.component.html',
  styleUrl: './videoders-form.component.css'
})
export class VideodersFormComponent implements OnInit {
  @Input() initialData?: VideoDers;
  @Output() save = new EventEmitter<VideoDers>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      kodu: [''],
      adi: ['', Validators.required],
      version: [''],
      tahminiDersSuresi: [''],
      tahminiDersTeslimTarihi: [''],
      baslamaTarihi: [''],
      dersTeslimTarihi: [''],
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
      onayDurumu: [''],
      paydasId: [''],
      odemeKaynak: [''],
      birimUcret: [''],
      toplamUcret: [''],
      durumKodu: [''],
      icerikYoneticisiId: [''],
      projeYoneticisiId: [''],
      materyalGelistiriciId: [''],
      kontrolEdenId: [''],
      grafikDuzenleyiciId: [''],
      videoDuzenleyiciId: [''],
      lmsSorumluId: [''],
      medyaSorumluId: [''],
      dersKodu: ['']
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
