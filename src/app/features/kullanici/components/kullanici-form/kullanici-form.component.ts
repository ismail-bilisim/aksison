import { Component, EventEmitter, Input,
  OnChanges, OnInit, Output, SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Kullanici } from 'src/app/core/models/kullanici';

@Component({
  selector: 'app-kullanici-form',
  standalone: true,
    imports: [ReactiveFormsModule],
  templateUrl: './kullanici-form.component.html',
})
export class KullaniciFormComponent implements OnInit, OnChanges {
  @Input() initialData?: Kullanici;
  @Output() save = new EventEmitter<Kullanici>();

  form: FormGroup;
  get isEditMode(): boolean {
    return !!this.initialData;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [null],
      ad: ['', [Validators.required, Validators.maxLength(100)]],
      soyad: ['', [Validators.required, Validators.maxLength(100)]],
      kullaniciAdi: ['', [Validators.required, Validators.maxLength(100)]],
      sifre: [''], // Initially no validators
      tcKimlikNo: [null],
      dogumTarihi: [''],
      cinsiyet: ['', Validators.maxLength(5)],
      telefon: ['', Validators.maxLength(20)],
      ePosta: ['', [Validators.email, Validators.maxLength(150)]],
      aktifMi: [true],
      version: [null],
      ekleyenKullaniciId: [null],
    });
  }

  ngOnInit() {
    this.updatePasswordValidation();
    if (this.initialData) {
      this.patchForm(this.initialData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']) {
      this.updatePasswordValidation();
      if (changes['initialData'].currentValue) {
        this.patchForm(changes['initialData'].currentValue);
      }
    }
  }

  private updatePasswordValidation() {
    const sifreControl = this.form.get('sifre');
    if (!sifreControl) return;

    if (this.isEditMode) {
      // Güncelleme modunda: şifre opsiyonel ama girilirse 8-16 karakter olmalı
      sifreControl.clearValidators();
      sifreControl.setValidators([
        Validators.minLength(8),
        Validators.maxLength(16)
      ]);
    } else {
      // Yeni kayıt modunda: şifre zorunlu ve 8-16 karakter olmalı
      sifreControl.clearValidators();
      sifreControl.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]);
    }
    
    sifreControl.updateValueAndValidity();
  }

  private patchForm(data: Kullanici) {
    // Şifre hariç diğer alanları patch'le
    const { sifre, ...dataWithoutPassword } = data as any;
    this.form.patchValue(dataWithoutPassword);
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = { ...this.form.value };

      // Güncelleme modunda şifre boşsa, şifre alanını çıkar
      if (this.isEditMode && (!formValue.sifre || formValue.sifre.trim() === '')) {
        delete formValue.sifre;
      }

      this.save.emit(formValue);
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  hasError(controlName: string, errorKey: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorKey);
  }
}

