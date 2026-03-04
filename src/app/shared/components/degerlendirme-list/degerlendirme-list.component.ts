import { Component, Input, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { VideodersDegerlendirmeService } from 'src/app/core/services/api/videoders-degerlendirme.service';
import { DegerlendirmeKriterService } from 'src/app/core/services/api/degerlendirme-kriter.service';
import {
  DersDegerlendirmeRequest,
  DersDegerlendirmeResponse,
  DegerlendirmeKriterRequest,
  KriterOzet
} from 'src/app/core/models/degerlendirme';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-degerlendirme-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './degerlendirme-list.component.html',
  styleUrl: './degerlendirme-list.component.css'
})
export class DegerlendirmeListComponent implements OnInit {
  @Input() dersId!: number;
  @Input() canModify: boolean = false;

  @ViewChild('degerlendirmeModal') degerlendirmeModal!: TemplateRef<any>;
  @ViewChild('kriterModal') kriterModal!: TemplateRef<any>;

  private readonly degerlendirmeService = inject(VideodersDegerlendirmeService);
  private readonly kriterService = inject(DegerlendirmeKriterService);
  private readonly modalService = inject(NgbModal);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  degerlendirmeler: DersDegerlendirmeResponse[] = [];
  availableKriterler: KriterOzet[] = [];
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
    this.loadDegerlendirmeler();
  }

  private initializeForms(): void {
    this.degerlendirmeForm = this.fb.group({
      adi: ['', [Validators.required, Validators.maxLength(255)]],
      aciklama: ['', Validators.maxLength(1000)]
    });

    this.kriterForm = this.fb.group({
      kriterKodu: ['', Validators.required],
      kriterPuan: [null, [Validators.required, Validators.min(1), Validators.max(3)]],
      aciklama: ['', Validators.maxLength(1000)]
    });
  }

  private loadDegerlendirmeler(): void {
    this.degerlendirmeService.getAllByDersId(this.dersId).subscribe({
      next: (data) => {
        console.log('Değerlendirmeler Yüklendi:', data);
        this.degerlendirmeler = data;
      },
      error: (error) => {
        console.error('Error loading degerlendirmeler:', error);
        this.toastService.error('Değerlendirmeler yüklenirken hata oluştu');
      }
    });
  }

  // DEGERLENDIRME OPERATIONS

  openDegerlendirmeModal(): void {
    this.degerlendirmeForm.reset();
    this.modalService.open(this.degerlendirmeModal, { centered: true });
  }

  saveDegerlendirme(): void {
    if (this.degerlendirmeForm.invalid) {
      this.toastService.warning('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const request: DersDegerlendirmeRequest = {
      dersId: this.dersId,
      adi: this.degerlendirmeForm.value.adi,
      aciklama: this.degerlendirmeForm.value.aciklama
    };

    this.degerlendirmeService.create(request).subscribe({
      next: () => {
        this.toastService.success('Değerlendirme başarıyla eklendi.');
        this.loadDegerlendirmeler();
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.toastService.error('Değerlendirme eklenirken hata oluştu.');
        console.error('Error creating degerlendirme:', error);
      }
    });
  }

  deleteDegerlendirme(degerlendirmeId: number): void {
    if (!confirm('Bu değerlendirmeyi silmek istediğinizden emin misiniz? İlişkili tüm kriterler de silinecektir.')) {
      return;
    }

    this.degerlendirmeService.delete(degerlendirmeId, this.dersId).subscribe({
      next: () => {
        this.toastService.success('Değerlendirme başarıyla silindi.');
        this.loadDegerlendirmeler();
      },
      error: (error) => {
        this.toastService.error('Değerlendirme silinirken hata oluştu.');
        console.error('Error deleting degerlendirme:', error);
      }
    });
  }

  // KRITER OPERATIONS

  openKriterModal(degerlendirmeId: number): void {
    this.currentDegerlendirmeId = degerlendirmeId;
    this.kriterForm.reset();

    // Kriter listesini yükle
    if (this.availableKriterler.length === 0) {
      this.kriterService.getAllKriterler().subscribe({
        next: (data) => {
          this.availableKriterler = data;
          this.modalService.open(this.kriterModal, { centered: true });
        },
        error: (error) => {
          this.toastService.error('Kriterler yüklenirken hata oluştu.');
          console.error('Error loading kriterler:', error);
        }
      });
    } else {
      this.modalService.open(this.kriterModal, { centered: true });
    }
  }

  saveKriter(): void {
    if (this.kriterForm.invalid || !this.currentDegerlendirmeId) {
      this.toastService.warning('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const request: DegerlendirmeKriterRequest = {
      degerlendirmeId: this.currentDegerlendirmeId,
      kriterKodu: this.kriterForm.value.kriterKodu,
      kriterPuan: this.kriterForm.value.kriterPuan,
      aciklama: this.kriterForm.value.aciklama
    };

    this.kriterService.create(request).subscribe({
      next: () => {
        this.toastService.success('Kriter başarıyla eklendi.');
        this.loadDegerlendirmeler();
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.toastService.error('Kriter eklenirken hata oluştu.');
        console.error('Error creating kriter:', error);
      }
    });
  }

  deleteKriter(kriterId: number, degerlendirmeId: number): void {
    if (!confirm('Bu kriteri silmek istediğinizden emin misiniz?')) {
      return;
    }

    this.kriterService.delete(kriterId, degerlendirmeId).subscribe({
      next: () => {
        this.toastService.success('Kriter başarıyla silindi.');
        this.loadDegerlendirmeler();
      },
      error: (error) => {
        this.toastService.error('Kriter silinirken hata oluştu.');
        console.error('Error deleting kriter:', error);
      }
    });
  }

  // HELPER METHODS

  hasKriterler(degerlendirme: DersDegerlendirmeResponse): boolean {
    return (degerlendirme.kriterler?.length || 0) > 0;
  }

  getPuanInfo(puan: number): { label: string; badge: string; emoji: string } {
    return this.puanLabels[puan] || { label: 'Bilinmiyor', badge: 'bg-secondary', emoji: '⚪' };
  }
}
