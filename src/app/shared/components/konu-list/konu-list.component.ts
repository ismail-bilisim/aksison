import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DersBolumRequest, DersBolumResponse, BolumKonuRequest } from 'src/app/core/models/ders-bolum';
import { SoruVideoDersKonuRequest } from 'src/app/core/models/soru-ders-konu';
import { SoruModalComponent } from 'src/app/shared/components/soru-modal/soru-modal.component';

@Component({
  selector: 'app-konu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule, SoruModalComponent],
  templateUrl: './konu-list.component.html',
  styleUrl: './konu-list.component.css'
})
export class KonuListComponent implements OnInit {
  @Input() dersId!: number;
  @Input() bolumlar: DersBolumResponse[] = [];
  @Input() loading = false;

  @Output() bolumAdd = new EventEmitter<DersBolumRequest>();
  @Output() bolumDelete = new EventEmitter<number>();
  @Output() konuAdd = new EventEmitter<BolumKonuRequest>();
  @Output() konuDelete = new EventEmitter<number>();
  @Output() soruSaveRequested = new EventEmitter<SoruVideoDersKonuRequest>();

  @ViewChild('bolumModal') bolumModal!: TemplateRef<any>;
  @ViewChild('konuModal') konuModal!: TemplateRef<any>;
  @ViewChild(SoruModalComponent) soruModal!: SoruModalComponent;

  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);

  bolumForm!: FormGroup;
  konuForm!: FormGroup;
  
  // For tracking where to insert new items
  currentBolumInsertPosition: { after: number | null; before: number | null } = { after: null, before: null };
  currentKonuInsertPosition: { bolumId: number; after: number | null; before: number | null } | null = null;

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.bolumForm = this.fb.group({
      baslik: ['', [Validators.required, Validators.maxLength(255)]],
      aciklama: ['', Validators.maxLength(1000)]
    });

    this.konuForm = this.fb.group({
      baslik: ['', [Validators.required, Validators.maxLength(255)]],
      aciklama: ['', Validators.maxLength(1000)]
    });
  }

  // BOLUM OPERATIONS

  openBolumModal(after: number | null = null, before: number | null = null): void {
    this.currentBolumInsertPosition = { after, before };
    this.bolumForm.reset();
    this.modalService.open(this.bolumModal, { centered: true });
  }

  saveBolum(): void {
    if (this.bolumForm.invalid) return;

    const request: DersBolumRequest = {
      dersId: this.dersId,
      bolum: this.bolumForm.value,
      oncekiSiraNo: this.currentBolumInsertPosition.after,
      sonrakiSiraNo: this.currentBolumInsertPosition.before
    };

    this.bolumAdd.emit(request);
    this.modalService.dismissAll();
  }

  deleteBolum(dersBolumId: number): void {
    if (!confirm('Bu bölümü silmek istediğinizden emin misiniz? Bölüme ait tüm konular da silinecektir.')) {
      return;
    }
    this.bolumDelete.emit(dersBolumId);
  }

  // KONU OPERATIONS

  openKonuModal(bolumId: number, after: number | null = null, before: number | null = null): void {
    this.currentKonuInsertPosition = { bolumId, after, before };
    this.konuForm.reset();
    this.modalService.open(this.konuModal, { centered: true });
  }

  saveKonu(): void {
    if (this.konuForm.invalid || !this.currentKonuInsertPosition) return;

    const request: BolumKonuRequest = {
      bolumId: this.currentKonuInsertPosition.bolumId,
      konu: this.konuForm.value,
      oncekiSiraNo: this.currentKonuInsertPosition.after,
      sonrakiSiraNo: this.currentKonuInsertPosition.before
    };

    this.konuAdd.emit(request);
    this.modalService.dismissAll();
  }

  deleteKonu(bolumKonuId: number): void {
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
      return;
    }
    this.konuDelete.emit(bolumKonuId);
  }

  // HELPER METHODS

  getBolumSiraNo(index: number): number | null {
    return this.bolumlar[index]?.bolumSiraNo || null;
  }

  getKonuSiraNo(bolum: DersBolumResponse, index: number): number | null {
    return bolum.bolum.bolumKonular?.[index]?.konuSiraNo || null;
  }

  hasKonular(bolum: DersBolumResponse): boolean {
    return (bolum.bolum.bolumKonular?.length || 0) > 0;
  }

  // SORU OPERATIONS
  openSoruModalForKonu(konuId: number): void {
    this.soruModal.open(konuId);
  }
}
