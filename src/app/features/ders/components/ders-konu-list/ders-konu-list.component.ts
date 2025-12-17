import { Component, Input, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DersBolumService } from 'src/app/core/services/api/ders-bolum.service';
import { BolumKonuService } from 'src/app/core/services/api/bolum-konu.service';
import { DersBolumResponse, DersBolumRequest, BolumKonuRequest } from 'src/app/core/models/ders-bolum';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-ders-konu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './ders-konu-list.component.html',
  styleUrl: './ders-konu-list.component.css'
})
export class DersKonuListComponent implements OnInit {
  @Input() dersId!: number;

  @ViewChild('bolumModal') bolumModal!: TemplateRef<any>;
  @ViewChild('konuModal') konuModal!: TemplateRef<any>;

  private dersBolumService = inject(DersBolumService);
  private bolumKonuService = inject(BolumKonuService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  bolumlar: DersBolumResponse[] = [];
  bolumForm!: FormGroup;
  konuForm!: FormGroup;
  
  // For tracking where to insert new items
  currentBolumInsertPosition: { after: number | null; before: number | null } = { after: null, before: null };
  currentKonuInsertPosition: { bolumId: number; after: number | null; before: number | null } | null = null;

  ngOnInit(): void {
    this.initializeForms();
    this.loadBolumlar();
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

  private loadBolumlar(): void {
    this.dersBolumService.getAllByDersIdOrdered(this.dersId).subscribe({
      next: (data) => {
        this.bolumlar = data;
      },
      error: (error) => {
        console.error('Error loading bolumlar:', error);
        this.toastService.error('Bölümler yüklenirken hata oluştu');
      }
    });
  }

  // BOLUM OPERATIONS

  openBolumModal(after: number | null = null, before: number | null = null): void {
    this.currentBolumInsertPosition = { after, before };
    this.bolumForm.reset();
    this.modalService.open(this.bolumModal, { centered: true });
  }

  saveBolum(): void {
    if (this.bolumForm.invalid) {
      this.toastService.warning('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const request: DersBolumRequest = {
      dersId: this.dersId,
      bolum: this.bolumForm.value,
      oncekiSiraNo: this.currentBolumInsertPosition.after,
      sonrakiSiraNo: this.currentBolumInsertPosition.before
    };

    this.dersBolumService.create(request).subscribe({
      next: () => {
        this.toastService.success('Bölüm başarıyla eklendi.');
        this.loadBolumlar();
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.toastService.error('Bölüm eklenirken hata oluştu.');
        console.error('Error creating bolum:', error);
      }
    });
  }

  deleteBolum(dersBolumId: number): void {
    if (!confirm('Bu bölümü silmek istediğinizden emin misiniz? Bölüme ait tüm konular da silinecektir.')) {
      return;
    }

    this.dersBolumService.delete(dersBolumId).subscribe({
      next: () => {
        this.toastService.success('Bölüm başarıyla silindi.');
        this.loadBolumlar();
      },
      error: (error) => {
        this.toastService.error('Bölüm silinirken hata oluştu.');
        console.error('Error deleting bolum:', error);
      }
    });
  }

  // KONU OPERATIONS

  openKonuModal(bolumId: number, after: number | null = null, before: number | null = null): void {
    this.currentKonuInsertPosition = { bolumId, after, before };
    this.konuForm.reset();
    this.modalService.open(this.konuModal, { centered: true });
  }

  saveKonu(): void {
    if (this.konuForm.invalid || !this.currentKonuInsertPosition) {
      this.toastService.warning('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const request: BolumKonuRequest = {
      bolumId: this.currentKonuInsertPosition.bolumId,
      konu: this.konuForm.value,
      oncekiSiraNo: this.currentKonuInsertPosition.after,
      sonrakiSiraNo: this.currentKonuInsertPosition.before
    };

    this.bolumKonuService.create(request).subscribe({
      next: () => {
        this.toastService.success('Konu başarıyla eklendi.');
        this.loadBolumlar();
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.toastService.error('Konu eklenirken hata oluştu.');
        console.error('Error creating konu:', error);
      }
    });
  }

  deleteKonu(bolumKonuId: number): void {
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
      return;
    }

    this.bolumKonuService.delete(bolumKonuId).subscribe({
      next: () => {
        this.toastService.success('Konu başarıyla silindi.');
        this.loadBolumlar();
      },
      error: (error) => {
        this.toastService.error('Konu silinirken hata oluştu.');
        console.error('Error deleting konu:', error);
      }
    });
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