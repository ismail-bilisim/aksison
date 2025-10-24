import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { VideoDers } from 'src/app/core/models/videoders';

@Component({
  selector: 'app-videoders-form',
  standalone: true,                     // important
  imports: [ ReactiveFormsModule], // bring in forms  
  templateUrl: './videoders-form.component.html',
  styleUrl: './videoders-form.component.css'
})

export class VideodersFormComponent {
  @Input() initialData?: VideoDers;
  @Output() save = new EventEmitter<VideoDers>();

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
    });
  }

  ngOnInit() {
    if (this.initialData) this.form.patchValue(this.initialData);
  }

  onSubmit() {
    if (this.form.valid) this.save.emit(this.form.value);
  }
}
