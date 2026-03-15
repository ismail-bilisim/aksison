import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SoruResponse } from 'src/app/core/models/soru-response';
import { debounceTime, startWith } from 'rxjs';

@Component({
  selector: 'app-soru-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './soru-form.component.html',
  styleUrl: './soru-form.component.css'
})
export class SoruFormComponent implements OnInit {
  @Input() initialData?: SoruResponse;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formDirtyChange = new EventEmitter<boolean>();

  private readonly fb = inject(FormBuilder);

  soruForm!: FormGroup;

  soruTipleri = [
    { kod: 'COK', label: 'Çoktan Seçmeli' },
    { kod: 'DOY', label: 'Doğru-Yanlış' }    
  ];

  zorlukDereceleri = [
    { kod: 'KOL', label: 'Kolay' },
    { kod: 'ORT', label: 'Orta' },
    { kod: 'ZOR', label: 'Zor' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.setupDynamicValidation();
    
    if (this.initialData) {
      this.populateForm();
    }
    
    this.trackFormDirtyState();
  }

  private initializeForm(): void {
    this.soruForm = this.fb.group({
      soruTipi: ['', [Validators.required]],
      soruMetni: ['', [Validators.required, Validators.maxLength(1000)]],
      zorlukDerecesi: ['', [Validators.required]],
      secenek1: ['', [Validators.required, Validators.maxLength(1000)]],
      secenek2: ['', [Validators.required, Validators.maxLength(1000)]],
      secenek3: ['', [Validators.maxLength(1000)]],
      secenek4: ['', [Validators.maxLength(1000)]],
      dogruSecenek: [1, [Validators.required, Validators.min(1)]],
      kontrolAciklama: ['', [Validators.maxLength(255)]]
    });
  }

  private setupDynamicValidation(): void {
    this.soruForm.get('soruTipi')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe((soruTipi: string) => {
        const secenek3Control = this.soruForm.get('secenek3');
        const secenek4Control = this.soruForm.get('secenek4');
        const dogruSecenekControl = this.soruForm.get('dogruSecenek');

        if (soruTipi === 'COKSC') {
          secenek3Control?.setValidators([Validators.required, Validators.maxLength(1000)]);
          secenek4Control?.setValidators([Validators.required, Validators.maxLength(1000)]);
          dogruSecenekControl?.enable();
          dogruSecenekControl?.setValidators([Validators.required, Validators.min(1), Validators.max(4)]);
          // dogruSecenek değerini sadece geçersiz ise düzelt
          if (dogruSecenekControl?.value > 4 || !dogruSecenekControl?.value) {
            dogruSecenekControl?.setValue(1);
          }
        } else if (soruTipi === 'DOGYN') {
          secenek3Control?.clearValidators();
          secenek4Control?.clearValidators();
          // Sadece dolu değilse temizle
          if (!this.initialData || secenek3Control?.value) {
            secenek3Control?.setValue('');
          }
          if (!this.initialData || secenek4Control?.value) {
            secenek4Control?.setValue('');
          }
          // dogruSecenek değerini sadece geçersiz ise düzelt
          if (dogruSecenekControl?.value > 2 || !dogruSecenekControl?.value) {
            dogruSecenekControl?.setValue(1);
          }
          dogruSecenekControl?.disable();
          dogruSecenekControl?.setValidators([Validators.required, Validators.min(1), Validators.max(2)]);
        }
        
        secenek3Control?.updateValueAndValidity();
        secenek4Control?.updateValueAndValidity();
        dogruSecenekControl?.updateValueAndValidity();
      });
  }

  private trackFormDirtyState(): void {
    this.soruForm.statusChanges
      .pipe(
        startWith(this.soruForm.status),
        debounceTime(100)
      )
      .subscribe(() => {
        this.formDirtyChange.emit(this.soruForm.dirty);
      });
  }

  private populateForm(): void {
    if (!this.initialData) return;

    this.soruForm.patchValue({
      soruTipi: this.initialData.soruTipi,
      soruMetni: this.initialData.soruMetni,
      zorlukDerecesi: this.initialData.zorlukDerecesi,
      secenek1: this.initialData.secenek1,
      secenek2: this.initialData.secenek2,
      secenek3: this.initialData.secenek3 || '',
      secenek4: this.initialData.secenek4 || '',
      dogruSecenek: this.initialData.dogruSecenek,
      kontrolAciklama: this.initialData.kontrolAciklama || ''
    }, { emitEvent: false });

    // DOGYN tipindeki sorular için dogruSecenek'i disable et
    if (this.initialData.soruTipi.kodu === 'COK') {
      this.soruForm.get('dogruSecenek')?.disable({ emitEvent: false });
    }

    // Form'u pristine olarak işaretle
    this.soruForm.markAsPristine();
  }

  onSubmit(): void {
    if (this.soruForm.invalid) {
      this.soruForm.markAllAsTouched();
      return;
    }

    const soruTipi = this.soruForm.value.soruTipi;
    const secenekSayisi = soruTipi === 'COK' ? 4 : 2;

    const formValue = {
      ...this.soruForm.value,
      secenekSayisi: secenekSayisi,
      dogruSecenek: soruTipi === 'DOY' ? 1 : this.soruForm.value.dogruSecenek,
      version: this.initialData?.version
    };

    this.save.emit(formValue);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
