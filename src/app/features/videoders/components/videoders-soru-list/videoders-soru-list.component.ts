import { Component, Input, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SoruService } from 'src/app/core/services/api/soru.service';
import { SoruVideoDersKonuResponse, SoruVideoDersKonuRequest } from 'src/app/core/models/soru-videoders-konu';
import { ToastService } from '../../../../core/services/api/toast.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-videoders-soru-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './videoders-soru-list.component.html',
  styleUrl: './videoders-soru-list.component.css'
})
export class VideodersSoruListComponent implements OnInit {
  @Input() dersId!: number;

  @ViewChild('soruModal') soruModal!: TemplateRef<any>;

  private readonly soruService = inject(SoruService);
  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  sorular: SoruVideoDersKonuResponse[] = [];
  soruForm!: FormGroup;

  // Dropdown options
  soruTipleri = [
    { kod: 'COK', label: 'Çoktan Seçmeli' },
    { kod: 'DOY', label: 'Doğru-Yanlış' },
    { kod: 'AUC', label: 'Açık uçlu' }
    
  ];

  zorlukDereceleri = [
    { kod: 'KOL', label: 'Kolay' },
    { kod: 'ORT', label: 'Orta' },
    { kod: 'ZOR', label: 'Zor' }
  ];

  secenekSayilari = [2, 3, 4];

  ngOnInit(): void {
    this.initializeForm();
    this.setupDynamicValidation();
    this.loadSorular();
  }

  private initializeForm(): void {
    this.soruForm = this.fb.group({
      soruTipi: ['', [Validators.required]],
      soruMetni: ['', [Validators.required, Validators.maxLength(1000)]],
      zorlukDerecesi: ['', [Validators.required]],
      secenekSayisi: [2, [Validators.required, Validators.min(2), Validators.max(4)]],
      secenek1: ['', [Validators.required, Validators.maxLength(1000)]],
      secenek2: ['', [Validators.required, Validators.maxLength(1000)]],
      secenek3: ['', [Validators.maxLength(1000)]],
      secenek4: ['', [Validators.maxLength(1000)]],
      dogruSecenek: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
      kontrolAciklama: ['', [Validators.maxLength(255)]]
    });
  }

  private setupDynamicValidation(): void {
    // Dynamic validation based on secenekSayisi
    this.soruForm.get('secenekSayisi')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe((count: number) => {
        const secenek3Control = this.soruForm.get('secenek3');
        const secenek4Control = this.soruForm.get('secenek4');
        const dogruSecenekControl = this.soruForm.get('dogruSecenek');

        // Update secenek3 validation
        if (count >= 3) {
          secenek3Control?.setValidators([Validators.required, Validators.maxLength(1000)]);
        } else {
          secenek3Control?.clearValidators();
          secenek3Control?.setValue('');
        }
        secenek3Control?.updateValueAndValidity();

        // Update secenek4 validation
        if (count >= 4) {
          secenek4Control?.setValidators([Validators.required, Validators.maxLength(1000)]);
        } else {
          secenek4Control?.clearValidators();
          secenek4Control?.setValue('');
        }
        secenek4Control?.updateValueAndValidity();

        // Update dogruSecenek max validator
        dogruSecenekControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(count)
        ]);
        
        // Reset dogruSecenek if it exceeds new count
        if (dogruSecenekControl?.value > count) {
          dogruSecenekControl?.setValue(1);
        }
        dogruSecenekControl?.updateValueAndValidity();
      });
  }

  private loadSorular(): void {
    this.soruService.getAllByDersId(this.dersId).subscribe({
      next: (data) => {
        console.log('Sorular yüklendi:', data);
        this.sorular = data;
      },
      error: (error) => {
        console.error('Error loading sorular:', error);
        this.toastService.error('Sorular yüklenirken hata oluştu');
      }
    });
  }

  openSoruModal(): void {
    this.soruForm.reset({
      secenekSayisi: 2,
      dogruSecenek: 1
    });
    this.modalService.open(this.soruModal, { centered: true, size: 'lg' });
  }

  saveSoru(): void {
    if (this.soruForm.invalid) {
      this.toastService.warning('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const request: SoruVideoDersKonuRequest = {
      dersId: this.dersId,
      konuId: null,  // Sorular sekmesinden eklendiğinde konu ile ilişkilendirilmez
      soru: {
        soruTipi: this.soruForm.value.soruTipi,
        soruMetni: this.soruForm.value.soruMetni,
        zorlukDerecesi: this.soruForm.value.zorlukDerecesi,
        secenekSayisi: this.soruForm.value.secenekSayisi,
        secenek1: this.soruForm.value.secenek1,
        secenek2: this.soruForm.value.secenek2,
        secenek3: this.soruForm.value.secenek3 || undefined,
        secenek4: this.soruForm.value.secenek4 || undefined,
        dogruSecenek: this.soruForm.value.dogruSecenek,
      }
    };

    this.soruService.create(request).subscribe({
      next: () => {
        this.toastService.success('Soru başarıyla eklendi');
        this.modalService.dismissAll();
        this.loadSorular();
      },
      error: (error) => {
        console.error('Error saving soru:', error);
        this.toastService.error('Soru eklenirken hata oluştu');
      }
    });
  }

  deleteSoru(soru: SoruVideoDersKonuResponse): void {
    const soruMetniKisa = soru.soru.soruMetni.length > 50 
      ? soru.soru.soruMetni.substring(0, 50) + '...' 
      : soru.soru.soruMetni;
      
    if (confirm(`"${soruMetniKisa}" sorusunu silmek istediğinize emin misiniz?`)) {
      this.soruService.delete(soru.dersId, soru.konuId || 0, soru.soruId).subscribe({
        next: () => {
          this.toastService.success('Soru başarıyla silindi');
          this.loadSorular();
        },
        error: (error) => {
          console.error('Error deleting soru:', error);
          this.toastService.error('Soru silinirken hata oluştu');
        }
      });
    }
  }

  getSoruTipiLabel(soruTipi: any): string {
    if (typeof soruTipi === 'string') {
      return soruTipi;
    }
    // Enum nesnesinden kod çekmek için
    return soruTipi?.kod || soruTipi || '-';
  }
}