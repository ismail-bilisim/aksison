import { Component, Input, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DersKonuService } from '../../../../core/services/ders-konu.service';
import { DersKonu, DersKonuRequest, BolumGroup, KonuRequest } from '../../../../core/models/ders-konu';

@Component({
  selector: 'app-ders-konu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './ders-konu-list.component.html',
  styleUrl: './ders-konu-list.component.css'
})
export class DersKonuListComponent implements OnInit {
  @Input() dersId!: number;

  private dersKonuService = inject(DersKonuService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);

  @ViewChild('konuModal') konuModalTemplate!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModalTemplate!: TemplateRef<any>;
  @ViewChild('bolumModal') bolumModalTemplate!: TemplateRef<any>;

  bolumGroups: BolumGroup[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Modal forms
  konuForm!: FormGroup;
  bolumForm!: FormGroup;
  isEditMode = false;
  isNewBolum = false;
  selectedKonu: DersKonu | null = null;
  submitting = false;
  // For tracking previous/next IDs during konu creation
  private previousKonuSiraNo?: number;
  private nextKonuSiraNo?: number;

  ngOnInit(): void {
    this.initForms();
    if (this.dersId) {
      this.loadKonular();
    }
  }

  private initForms(): void {
    this.konuForm = this.fb.group({
      bolumNumara: [1000, [Validators.required, Validators.min(0)]],
      bolumAdi: ['', Validators.required],
      konu: this.fb.group({
        baslik: ['', Validators.required],
        aciklama: ['']
      })
      // konuSiraNo is removed from here
    });

    this.bolumForm = this.fb.group({
      bolumAdi: ['', Validators.required]
    });
  }

  loadKonular(): void {
    this.isLoading = true;
    this.error = null;

    this.dersKonuService.getAllByDersIdOrdered(this.dersId).subscribe({
      next: (konular) => {
        this.bolumGroups = this.groupByBolum(konular);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Konular yüklenirken hata oluştu';
        this.isLoading = false;
        console.error('Error loading konular:', err);
      }
    });
  }

  private groupByBolum(konular: DersKonu[]): BolumGroup[] {
    const groupMap = new Map<number, BolumGroup>();

    konular.forEach(konu => {
      if (!groupMap.has(konu.bolumNumara)) {
        groupMap.set(konu.bolumNumara, {
          bolumNumara: konu.bolumNumara,
          bolumAdi: konu.bolumAdi,
          konular: []
        });
      }
      groupMap.get(konu.bolumNumara)!.konular.push(konu);
    });

    return Array.from(groupMap.values()).sort((a, b) => a.bolumNumara - b.bolumNumara);
  }

  onDrop(event: CdkDragDrop<DersKonu[]>, bolumGroup: BolumGroup): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(bolumGroup.konular, event.previousIndex, event.currentIndex);

    const movedKonu = bolumGroup.konular[event.currentIndex];
    const previousKonu = event.currentIndex > 0 ? bolumGroup.konular[event.currentIndex - 1] : null;
    const nextKonu = event.currentIndex < bolumGroup.konular.length - 1 
      ? bolumGroup.konular[event.currentIndex + 1] 
      : null;

    const afterPosition = previousKonu ? previousKonu.konuSiraNo : undefined;
    const beforePosition = nextKonu ? nextKonu.konuSiraNo : undefined;

    this.dersKonuService.calculateInsertPosition(
      this.dersId,
      bolumGroup.bolumNumara,
      afterPosition,
      beforePosition
    ).subscribe({
      next: (newPosition) => {
        this.dersKonuService.moveKonu(movedKonu.id, newPosition).subscribe({
          next: () => {
            movedKonu.konuSiraNo = newPosition;
            bolumGroup.konular.sort((a, b) => a.konuSiraNo - b.konuSiraNo);
          },
          error: (err) => {
            console.error('Error moving konu:', err);
            moveItemInArray(bolumGroup.konular, event.currentIndex, event.previousIndex);
            this.error = 'Konu taşınırken hata oluştu';
          }
        });
      },
      error: (err) => {
        console.error('Error calculating position:', err);
        moveItemInArray(bolumGroup.konular, event.currentIndex, event.previousIndex);
        this.error = 'Pozisyon hesaplanırken hata oluştu';
      }
    });
  }

  rebalanceBolum(bolumGroup: BolumGroup): void {
    this.dersKonuService.rebalanceKonular(this.dersId, bolumGroup.bolumNumara).subscribe({
      next: () => {
        this.loadKonular();
      },
      error: (err) => {
        console.error('Error rebalancing:', err);
        this.error = 'Yeniden dengeleme sırasında hata oluştu';
      }
    });
  }

  // New method for handling "Yeni Bölüm Ekle" - only asks for section name
  onAddBolum(): void {
    this.bolumForm.reset();
    this.modalService.open(this.bolumModalTemplate, { size: 'md' });
  }

  onAddKonu(bolumGroup?: BolumGroup, insertAfterKonu?: DersKonu): void {
    this.isEditMode = false;
    this.selectedKonu = null;
    this.isNewBolum = !bolumGroup;

    this.konuForm.get('bolumAdi')?.enable();

    const bolumNumara = bolumGroup?.bolumNumara || this.getNextBolumNumara();
    const bolumAdi = bolumGroup?.bolumAdi || '';

    // Reset previous/next IDs
    this.previousKonuSiraNo = undefined;
    this.nextKonuSiraNo = undefined;

    this.konuForm.reset({
      bolumNumara: bolumNumara,
      bolumAdi: bolumAdi,
      konu: { baslik: '', aciklama: '' }
    });

    if (bolumGroup) {
      this.konuForm.get('bolumAdi')?.disable();
      
      if (insertAfterKonu) {
        // Insert between two topics
        const insertIndex = bolumGroup.konular.findIndex(k => k.id === insertAfterKonu.id);
        const beforeKonu = bolumGroup.konular[insertIndex + 1];
        
        this.previousKonuSiraNo = insertAfterKonu.id;
        this.nextKonuSiraNo = beforeKonu?.id;

      } else {
        // Insert at the end of the section
        const lastKonu = bolumGroup.konular.length > 0 ? bolumGroup.konular[bolumGroup.konular.length - 1] : null;
        this.previousKonuSiraNo = lastKonu?.id;
        this.nextKonuSiraNo = undefined;
      }
    } else {
      // Adding a new section, no previous/next
      this.previousKonuSiraNo = undefined;
      this.nextKonuSiraNo = undefined;
    }
    
    this.modalService.open(this.konuModalTemplate, { size: 'lg' });
  }

  onEditKonu(konu: DersKonu): void {
    this.isEditMode = true;
    this.selectedKonu = konu;
    
    this.konuForm.patchValue({
      bolumNumara: konu.bolumNumara,
      bolumAdi: konu.bolumAdi,
      konu: {
        baslik: konu.konu.baslik,
        aciklama: konu.konu.aciklama
      }
      // konuSiraNo is removed from here
    });
    
    this.modalService.open(this.konuModalTemplate, { size: 'lg' });
  }

  onDeleteKonu(konu: DersKonu): void {
    this.selectedKonu = konu;
    this.modalService.open(this.deleteModalTemplate);
  }

  onSaveBolum(): void {
    if (this.bolumForm.invalid) {
      this.bolumForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const bolumAdi = this.bolumForm.value.bolumAdi;
    const bolumNumara = this.getNextBolumNumara();

    // Create a new konu for the section with default values
    const konuRequest: KonuRequest = {
      baslik: '',
      aciklama: ''
    };

    const request: DersKonuRequest = {
      dersId: this.dersId,
      bolumNumara: bolumNumara,
      bolumAdi: bolumAdi,
      konu: konuRequest,
      previousKonuSiraNo: this.previousKonuSiraNo,
      nextKonuSiraNo: this.nextKonuSiraNo
    };

    this.dersKonuService.create(request).subscribe({
      next: () => {
        this.loadKonular();
        this.modalService.dismissAll();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error saving bolum:', err);
        this.error = 'Bölüm kaydedilirken hata oluştu';
        this.submitting = false;
      }
    });
  }

  onSaveKonu(): void {
    if (this.konuForm.invalid) {
      this.konuForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.konuForm.value;

    const konuRequest: KonuRequest = {
      baslik: formValue.konu.baslik,
      aciklama: formValue.konu.aciklama
    };

    const request: DersKonuRequest = {
      dersId: this.dersId,
      bolumNumara: formValue.bolumNumara,
      bolumAdi: formValue.bolumAdi,
      konu: konuRequest,
      previousKonuSiraNo: this.previousKonuSiraNo,
      nextKonuSiraNo: this.nextKonuSiraNo,
      version: this.isEditMode ? this.selectedKonu?.version : undefined
    };

    const apiCall = this.isEditMode && this.selectedKonu
      ? this.dersKonuService.update(this.selectedKonu.id, request)
      : this.dersKonuService.create(request);

    apiCall.subscribe({
      next: () => {
        this.loadKonular();
        this.modalService.dismissAll();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error saving konu:', err);
        this.error = 'Konu kaydedilirken hata oluştu';
        this.submitting = false;
      }
    });
  }


  confirmDelete(): void {
    if (!this.selectedKonu) return;

    this.submitting = true;
    this.dersKonuService.delete(this.selectedKonu.id).subscribe({
      next: () => {
        this.loadKonular();
        this.modalService.dismissAll();
        this.submitting = false;
        this.selectedKonu = null;
      },
      error: (err) => {
        console.error('Error deleting konu:', err);
        this.error = 'Konu silinirken hata oluştu';
        this.submitting = false;
      }
    });
  }

  private getNextBolumNumara(): number {
    if (this.bolumGroups.length === 0) return 1000;
    const maxBolum = Math.max(...this.bolumGroups.map(g => g.bolumNumara));
    return maxBolum + 1000;
  }

  private getNextKonuSiraNo(bolumGroup: BolumGroup): number {
    if (bolumGroup.konular.length === 0) return 1000;
    const maxSiraNo = Math.max(...bolumGroup.konular.map(k => k.konuSiraNo));
    return maxSiraNo + 1000;
  }
}