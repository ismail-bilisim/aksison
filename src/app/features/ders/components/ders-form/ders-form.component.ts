import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ders } from 'src/app/core/models/ders';

@Component({
  selector: 'app-ders-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ders-form.component.html',
  styleUrl: './ders-form.component.css'
})
export class DersFormComponent implements OnInit {
  @Input() initialData?: Ders;
  @Output() save = new EventEmitter<Ders>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      adi: ['', Validators.required],
      amaci: [''],
      turuKodu: [''],
      seviyesiKodu: [''],
      niteligiKodu: [''],
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
