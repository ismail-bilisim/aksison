import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DersDegerlendirmeRequest,
  DersDegerlendirmeResponse,
  DegerlendirmeKriterRequest,
  KriterOzet,
  DegerlendirmeTuruOzet
} from 'src/app/core/models/degerlendirme';

@Component({
  selector: 'app-degerlendirme-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './degerlendirme-list.component.html',
  styleUrl: './degerlendirme-list.component.css'
})
export class DegerlendirmeListComponent implements OnInit {
  @Input() dersId!: number;
  @Input() degerlendirmeler: DersDegerlendirmeResponse[] = [];
  @Input() availableKriterler: KriterOzet[] = [];
  @Input() availableTurler: DegerlendirmeTuruOzet[] = [];
  @Input() loading = false;
  @Input() canModify: boolean = false;

  @Output() degerlendirmeAdd = new EventEmitter<DersDegerlendirmeRequest>();
  @Output() degerlendirmeDelete = new EventEmitter<number>();
  @Output() kriterAdd = new EventEmitter<DegerlendirmeKriterRequest>();
  @Output() kriterDelete = new EventEmitter<{ kriterId: number; degerlendirmeId: number }>();
  @Output() kriterLoadRequested = new EventEmitter<void>();
  @Output() turuLoadRequested = new EventEmitter<void>();

  @ViewChild('degerlendirmeModal') degerlendirmeModal!: TemplateRef<any>;
  @ViewChild('kriterModal') kriterModal!: TemplateRef<any>;

  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);

  degerlendirmeForm!: FormGroup;
  kriterForm!: FormGroup;

  // Kriter eklenecek değerlendirme ID'si
  currentDegerlendirmeId: number | null = null;

  // Puan etiketleri
  readonly puanLabels: { [key: number]: { label: string; badge: string; emoji: string } } = {
    1: { label: 'Kötü', badge: 'bg-danger', emoji: '🔴' },
    2: { label: 'Orta', badge: 'bg-warning text-dark', emoji: '🟡' },
    3: { label: 'İyi', badge: 'bg-success', emoji: '🟢' }
  };

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.degerlendirmeForm = this.fb.group({
      turuKodu: ['', Validators.required],
      aciklama: ['', Validators.maxLength(1000)]
    });

    this.kriterForm = this.fb.group({
      kriterKodu: ['', Validators.required],
      kriterPuan: [null, [Validators.required, Validators.min(1), Validators.max(3)]],
      aciklama: ['', Validators.maxLength(1000)]
    });
  }

  // DEGERLENDIRME OPERATIONS

  openDegerlendirmeModal(): void {
    this.degerlendirmeForm.reset();
    if (this.availableTurler.length === 0) {
      this.turuLoadRequested.emit();
    }
    this.modalService.open(this.degerlendirmeModal, { centered: true });
  }

  saveDegerlendirme(): void {
    if (this.degerlendirmeForm.invalid) return;

    const request: DersDegerlendirmeRequest = {
      dersId: this.dersId,
      turuKodu: this.degerlendirmeForm.value.turuKodu,
      aciklama: this.degerlendirmeForm.value.aciklama
    };

    this.degerlendirmeAdd.emit(request);
    this.modalService.dismissAll();
  }

  deleteDegerlendirme(degerlendirmeId: number): void {
    if (!confirm('Bu değerlendirmeyi silmek istediğinizden emin misiniz? İlişkili tüm kriterler de silinecektir.')) {
      return;
    }
    this.degerlendirmeDelete.emit(degerlendirmeId);
  }

  // KRITER OPERATIONS

  openKriterModal(degerlendirmeId: number): void {
    this.currentDegerlendirmeId = degerlendirmeId;
    this.kriterForm.reset();

    if (this.availableKriterler.length === 0) {
      this.kriterLoadRequested.emit();
    }
    this.modalService.open(this.kriterModal, { centered: true });
  }

  saveKriter(): void {
    if (this.kriterForm.invalid || !this.currentDegerlendirmeId) return;

    const request: DegerlendirmeKriterRequest = {
      degerlendirmeId: this.currentDegerlendirmeId,
      kriterKodu: this.kriterForm.value.kriterKodu,
      kriterPuan: this.kriterForm.value.kriterPuan,
      aciklama: this.kriterForm.value.aciklama
    };

    this.kriterAdd.emit(request);
    this.modalService.dismissAll();
  }

  deleteKriter(kriterId: number, degerlendirmeId: number): void {
    if (!confirm('Bu kriteri silmek istediğinizden emin misiniz?')) {
      return;
    }
    this.kriterDelete.emit({ kriterId, degerlendirmeId });
  }

  // HELPER METHODS

  hasKriterler(degerlendirme: DersDegerlendirmeResponse): boolean {
    return (degerlendirme.kriterler?.length || 0) > 0;
  }

  getPuanInfo(puan: number): { label: string; badge: string; emoji: string } {
    return this.puanLabels[puan] || { label: 'Bilinmiyor', badge: 'bg-secondary', emoji: '⚪' };
  }
}
