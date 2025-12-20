import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjeRequest } from '../../../../core/models/proje-request';
import { ProjeResponse } from '../../../../core/models/proje-response';
import { debounceTime, startWith } from 'rxjs';

@Component({
  selector: 'app-proje-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proje-form.component.html',
  styleUrl: './proje-form.component.css'
})
export class ProjeFormComponent implements OnInit, OnChanges {
  @Input() initialData?: ProjeResponse;
  @Input() editMode = false;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<ProjeRequest>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formDirtyChange = new EventEmitter<boolean>();

  form: FormGroup;

  get isEditMode(): boolean {
    return this.editMode || !!this.initialData;
  }

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      projeAdi: ['', [Validators.required, Validators.maxLength(255)]],
      baslangicTarihi: ['', [Validators.required]],
      aciklama: ['', [Validators.maxLength(500)]],
      version: [null]
    }, { validators: this.dateRangeValidator() });
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

  private patchForm(data: ProjeResponse): void {
    this.form.patchValue({
      projeAdi: data.projeAdi,
      baslangicTarihi: data.baslangicTarihi,
      aciklama: data.aciklama,
      version: data.version
    });
  }

  dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const baslangicTarihi = control.get('baslangicTarihi')?.value;
      const bitisTarihi = control.get('bitisTarihi')?.value;

      if (!baslangicTarihi || !bitisTarihi) {
        return null;
      }

      const start = new Date(baslangicTarihi);
      const end = new Date(bitisTarihi);
      
      const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff < 10) {
        return { dateRange: true };
      }

      return null;
    };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue: ProjeRequest = {
        projeAdi: this.form.value.projeAdi,
        baslangicTarihi: this.form.value.baslangicTarihi,
        aciklama: this.form.value.aciklama || '',
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

  hasFormError(errorName: string): boolean {
    return !!(this.form.hasError(errorName) && (this.form.get('baslangicTarihi')?.touched || this.form.get('bitisTarihi')?.touched));
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
