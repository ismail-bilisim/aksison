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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      ad: ['', [Validators.required, Validators.maxLength(100)]],
      soyad: ['', [Validators.required, Validators.maxLength(100)]],
      kullaniciAdi: ['', [Validators.required, Validators.maxLength(100)]],
      sifre: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(16)],
      ],
      tcKimlikNo: [null],
      dogumTarihi: [''],
      cinsiyet: ['', Validators.maxLength(5)],
      telefon: ['', Validators.maxLength(20)],
      getePosta: ['', [Validators.email, Validators.maxLength(150)]],
      aktifMi: [true],
      version: [null],
      ekleyenKullaniciId: [null],
    });
  }

  ngOnInit() {
    if (this.initialData) this.patchForm(this.initialData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']?.currentValue) {
      this.patchForm(changes['initialData'].currentValue);
    }
  }

  private patchForm(data: Kullanici) {
    this.form.patchValue(data);
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
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

