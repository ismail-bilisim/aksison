import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProsedurRequest } from 'src/app/core/models/prosedur-request';
import { SurecTuruOzet } from 'src/app/core/models/surec-turu-ozet';

export interface ProsedurFormLookupData {
  surecTurleri: SurecTuruOzet[];
}

@Component({
  selector: 'app-prosedur-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './prosedur-form.component.html'
})
export class ProsedurFormComponent implements OnInit, OnChanges {
  @Input() initialData?: ProsedurRequest;
  @Input() lookupData?: ProsedurFormLookupData;
  @Input() isEditMode = false;

  @Output() save = new EventEmitter<ProsedurRequest>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  constructor() {
    this.form = this.fb.group({
      adi: ['', Validators.required],
      amac: [''],
      kapsam: [''],
      surecAdimlari: [''],
      surecTuruKodu: ['']
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
      this.save.emit(this.form.value as ProsedurRequest);
    }
  }

  private patchForm(data?: ProsedurRequest): void {
    if (!data) return;
    this.form.patchValue(data, { emitEvent: false });
  }
}
