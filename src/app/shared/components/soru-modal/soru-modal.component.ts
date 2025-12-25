import { Component, Input, Output, EventEmitter, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SoruService } from 'src/app/core/services/api/soru-videoders.service';
import { SoruVideoDersKonuRequest } from 'src/app/core/models/soru-ders-konu';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-soru-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './soru-modal.component.html',
  styleUrl: './soru-modal.component.css'
})
export class SoruModalComponent implements OnInit {
  @Input() dersId!: number;
  @Output() soruSaved = new EventEmitter<void>();

  @ViewChild('soruModal') soruModal!: TemplateRef<any>;

  private readonly soruService = inject(SoruService);
  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  soruForm!: FormGroup;
  currentKonuId: number | null = null;

  // Dropdown options
  soruTipleri = [
    { kod: 'COKTAN_SECMELI', label: 'Çoktan Seçmeli' },
    { kod: 'DOGRU_YANLIS', label: 'Doğru-Yanlış' }    
  ];

  zorlukDereceleri = [
    { kod: 'KOLAY', label: 'Kolay' },
    { kod: 'ORTA', label: 'Orta' },
    { kod: 'ZOR', label: 'Zor' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.setupDynamicValidation();
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
    // Dynamic validation based on soruTipi
    this.soruForm.get('soruTipi')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe((soruTipi: string) => {
        const secenek3Control = this.soruForm.get('secenek3');
        const secenek4Control = this.soruForm.get('secenek4');
        const dogruSecenekControl = this.soruForm.get('dogruSecenek');

        if (soruTipi === 'COKTAN_SECMELI') {
          // Çoktan Seçmeli: 4 seçenek
          secenek3Control?.setValidators([Validators.required, Validators.maxLength(1000)]);
          secenek4Control?.setValidators([Validators.required, Validators.maxLength(1000)]);
          secenek3Control?.updateValueAndValidity();
          secenek4Control?.updateValueAndValidity();
          
          // Enable dogruSecenek and set max to 4
          dogruSecenekControl?.enable();
          dogruSecenekControl?.setValidators([Validators.required, Validators.min(1), Validators.max(4)]);
          if (dogruSecenekControl?.value > 4) {
            dogruSecenekControl?.setValue(1);
          }
        } else if (soruTipi === 'DOGRU_YANLIS') {
          // Doğru-Yanlış: 2 seçenek
          secenek3Control?.clearValidators();
          secenek4Control?.clearValidators();
          secenek3Control?.setValue('');
          secenek4Control?.setValue('');
          secenek3Control?.updateValueAndValidity();
          secenek4Control?.updateValueAndValidity();
          
          // Disable dogruSecenek and set to 1
          dogruSecenekControl?.setValue(1);
          dogruSecenekControl?.disable();
          dogruSecenekControl?.setValidators([Validators.required, Validators.min(1), Validators.max(2)]);
        }
        dogruSecenekControl?.updateValueAndValidity();
      });
  }

  open(konuId: number | null = null): void {
    this.currentKonuId = konuId;
    this.soruForm.reset({
      soruTipi:'COKTAN_SECMELI',
      zorlukDerecesi: 'ORTA',
      dogruSecenek: 1
    });
    this.modalService.open(this.soruModal, { centered: true, size: 'lg' });
  }

  saveSoru(): void {
    if (this.soruForm.invalid) {
      this.toastService.warning('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const soruTipi = this.soruForm.value.soruTipi;
    const secenekSayisi = soruTipi === 'COKTAN_SECMELI' ? 4 : 2;
    
    const request: SoruVideoDersKonuRequest = {
      dersId: this.dersId,
      konuId: this.currentKonuId,
      soru: {
        soruTipi: soruTipi,
        soruMetni: this.soruForm.value.soruMetni,
        zorlukDerecesi: this.soruForm.value.zorlukDerecesi,
        secenekSayisi: secenekSayisi,
        secenek1: this.soruForm.value.secenek1,
        secenek2: this.soruForm.value.secenek2,
        secenek3: this.soruForm.value.secenek3 || undefined,
        secenek4: this.soruForm.value.secenek4 || undefined,
        dogruSecenek: soruTipi === 'DOGRU_YANLIS' ? 1 : this.soruForm.value.dogruSecenek,
      }
    };

    this.soruService.createRelation(request).subscribe({
      next: () => {
        this.toastService.success('Soru başarıyla eklendi');
        this.modalService.dismissAll();
        this.soruSaved.emit();
      },
      error: (error) => {
        console.error('Error saving soru:', error);
        this.toastService.error('Soru eklenirken hata oluştu');
      }
    });
  }

  close(): void {
    this.modalService.dismissAll();
  }
}
