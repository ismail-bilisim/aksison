import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SozlesmeVideoDersService, SozlesmeVideoDersRequest } from 'src/app/core/services/api/sozlesme-videoders.service';

@Component({
  selector: 'app-sozlesme-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sozlesme-edit.component.html',
  styleUrls: ['./sozlesme-edit.component.css']
})
export class SozlesmeEditComponent {
  dersId!: number;
  egitmenId!: number;

  baslangicTarihi = '';
  sozlesmeDetails = '';
  loading = false;
  submitting = false;
  sablonLoaded = false;

  readonly activeModal = inject(NgbActiveModal);
  private readonly sozlesmeService = inject(SozlesmeVideoDersService);

  onBaslangicTarihiChange(): void {
    if (this.baslangicTarihi && this.egitmenId && this.dersId) {
      this.loadSablon();
    }
  }

  loadSablon(): void {
    this.loading = true;
    this.sozlesmeService.getSablon(this.egitmenId, this.dersId, this.baslangicTarihi).subscribe({
      next: (sablon) => {
        this.sozlesmeDetails = sablon;
        this.loading = false;
        this.sablonLoaded = true;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  create(): void {
    if (!this.baslangicTarihi || !this.sozlesmeDetails) return;

    this.submitting = true;
    const request: SozlesmeVideoDersRequest = {
      dersId: this.dersId,
      egitmenId: this.egitmenId,
      baslangicTarihi: this.baslangicTarihi,
      sozlesmeDetails: this.sozlesmeDetails
    };

    this.sozlesmeService.create(request).subscribe({
      next: (result) => {
        this.submitting = false;
        this.activeModal.close(result);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }
}
