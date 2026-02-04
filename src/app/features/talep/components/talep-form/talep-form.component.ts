import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TalepKonusuOzet } from 'src/app/core/models/talep-konusu';
import { TalepRequest } from 'src/app/core/models/talep-request';
import { ToastService } from 'src/app/core/services/api/toast.service'; // Assuming a ToastService exists

@Component({
  selector: 'app-talep-form',
  templateUrl: './talep-form.component.html',
  styleUrls: ['./talep-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]

})
export class TalepFormComponent implements OnInit, OnChanges {
  @Input() initialValue?: TalepRequest | null;
  @Input() isLoading = false;
  @Input() isEditMode = false;
  @Input() talepKonusu: TalepKonusuOzet[] | null= []; // Lookup'tan gelen talep konuları

  // Output - olayları parent'a iletme
  @Output() onSave = new EventEmitter <{ request: TalepRequest; files: File[] }>();
  @Output() onCancel = new EventEmitter<void>();

  // Form yapısı
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  
  talepForm: FormGroup;

  // Dosya yükleme ve mevcut dosyalar için alanlar
  selectedFiles: File[] = [];
  ekDosyalar: { id: number; dosyaAdi: string; dosyaBoyutu: number }[] = [];

  constructor(
  ) {
    // Bugünün tarihini YYYY-MM-DD formatında al
    const today = new Date().toISOString().split('T')[0];
    
    // Form olusturma Tercihi: class alanı olarak oluşturmak ama burada olabilir.
    this.talepForm = this.fb.group({
      talepKonusuKodu: ['', Validators.required],
      talepIcerik: ['', Validators.required],
      talepTarihi: [today, Validators.required],
      talepSahibi: ['', Validators.required],
      acilMi: []
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.initialValue) {
      // patchValue ile initialValue içinde gelen alanlar kadarını formun içine yaz (diğer alanlara dokunma)
      this.talepForm.patchValue(this.initialValue); 
      // patchValue = “eksik alan olsa da sorun yok , setValue = tam eşleşme şart
    }
  }

  onSubmit() {
    if (this.talepForm.invalid) {
      this.talepForm.markAllAsTouched();
      this.toastService.error('Lütfen tüm gerekli alanları doldurun.');
      return;
    } else {
      this.onSave.emit({ request: this.talepForm.value, files: this.selectedFiles });
    }

  }  

  // Dosya seçildiğinde çağrılır
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files.item(i)!);
      }
    }
  }

  // Seçili dosyayı kaldır
  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  
}
