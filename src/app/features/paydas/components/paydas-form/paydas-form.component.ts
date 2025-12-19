import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaydasRequest } from '../../../../core/models/paydas-request';
import { PaydasResponse } from '../../../../core/models/paydas-response';
import { debounceTime, startWith } from 'rxjs';

@Component({
  selector: 'app-paydas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paydas-form.component.html',
  styleUrl: './paydas-form.component.css'
})
export class PaydasFormComponent implements OnInit, OnChanges {
  @Input() initialData?: PaydasResponse;
  @Input() editMode = false;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<PaydasRequest>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formDirtyChange = new EventEmitter<boolean>();

  form: FormGroup;

  get isEditMode(): boolean {
    return this.editMode || !!this.initialData;
  }

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      adi: ['', [Validators.required, Validators.maxLength(100)]],
      temsilci: ['', [Validators.required, Validators.maxLength(255)]],
      telefon: ['', [Validators.maxLength(20)]],
      eposta: ['', [Validators.email, Validators.maxLength(150)]],
      adres: ['', [Validators.maxLength(500)]],
      version: [null]
    });
  }

  ngOnInit(): void {
    if (this.initialData) {
      this.patchForm(this.initialData);
    }

    // Track form dirty state and emit changes
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      debounceTime(100)
    ).subscribe(() => {
      this.formDirtyChange.emit(this.form.dirty);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']?.currentValue) {
      this.patchForm(changes['initialData'].currentValue);
    }
  }

  private patchForm(data: PaydasResponse): void {
    this.form.patchValue({
      adi: data.adi,
      temsilci: data.temsilci,
      telefon: data.telefon,
      eposta: data.eposta,
      adres: data.adres,
      version: data.version
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue: PaydasRequest = {
        adi: this.form.value.adi,
        temsilci: this.form.value.temsilci,
        telefon: this.form.value.telefon || undefined,
        eposta: this.form.value.eposta || undefined,
        adres: this.form.value.adres || undefined,
        version: this.form.value.version || undefined
      };
      this.save.emit(formValue);
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
