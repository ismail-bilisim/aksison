import { Component, Input, Output, EventEmitter, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DersBolumResponse, DersBolumRequest, BolumKonuRequest } from 'src/app/core/models/ders-bolum';

@Component({
  selector: 'app-ders-konu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './ders-konu-list.component.html',
  styleUrl: './ders-konu-list.component.css'
})
export class DersKonuListComponent implements OnInit {
  @Input() dersId!: number;
  @Input() bolumlar: DersBolumResponse[] = [];
  @Input() isLoading = false;

  @Output() saveBolum = new EventEmitter<DersBolumRequest>();
  @Output() deleteBolum = new EventEmitter<number>();
  @Output() saveKonu = new EventEmitter<BolumKonuRequest>();
  @Output() deleteKonu = new EventEmitter<number>();

  @ViewChild('bolumModal') bolumModal!: TemplateRef<any>;
  @ViewChild('konuModal') konuModal!: TemplateRef<any>;

  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);

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

  onSaveBolum(): void {
    if (this.bolumForm.invalid) {
      return;
    }

    const request: DersBolumRequest = {
      dersId: this.dersId,
      bolum: this.bolumForm.value,
      oncekiSiraNo: this.currentBolumInsertPosition.after,
      sonrakiSiraNo: this.currentBolumInsertPosition.before
    };

    this.saveBolum.emit(request);
    this.modalService.dismissAll();
  }

  onDeleteBolum(dersBolumId: number): void {
    if (!confirm('Bu bölümü silmek istediğinizden emin misiniz? Bölüme ait tüm konular da silinecektir.')) {
      return;
    }

    this.deleteBolum.emit(dersBolumId);
  }

  // KONU OPERATIONS

  openKonuModal(bolumId: number, after: number | null = null, before: number | null = null): void {
    this.currentKonuInsertPosition = { bolumId, after, before };
    this.konuForm.reset();
    this.modalService.open(this.konuModal, { centered: true });
  }

  onSaveKonu(): void {
    if (this.konuForm.invalid || !this.currentKonuInsertPosition) {
      return;
    }

    const request: BolumKonuRequest = {
      bolumId: this.currentKonuInsertPosition.bolumId,
      konu: this.konuForm.value,
      oncekiSiraNo: this.currentKonuInsertPosition.after,
      sonrakiSiraNo: this.currentKonuInsertPosition.before
    };

    this.saveKonu.emit(request);
    this.modalService.dismissAll();
  }

  onDeleteKonu(bolumKonuId: number): void {
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
      return;
    }

    this.deleteKonu.emit(bolumKonuId);
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
}