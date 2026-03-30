import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { StandartRequest } from 'src/app/core/models/standart-request';

export interface StandartDialogData {
  prosedurId: number;
  nextMaddeNo: number;
}

@Component({
  selector: 'app-prosedur-standart-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-container p-4">
      <h5 class="mb-3"><i class="bi bi-shield-plus me-2"></i>Yeni Standart Ekle</h5>

      <div class="mb-3">
        <label for="maddeNo" class="form-label">Madde No <span class="text-danger">*</span></label>
        <input id="maddeNo" type="number" class="form-control" [(ngModel)]="form.maddeNo">
      </div>

      <div class="mb-3">
        <label for="maddeAdi" class="form-label">Madde Adı <span class="text-danger">*</span></label>
        <input id="maddeAdi" type="text" class="form-control" [(ngModel)]="form.maddeAdi">
      </div>

      <div class="mb-3">
        <label for="icerik" class="form-label">İçerik</label>
        <textarea id="icerik" class="form-control" [(ngModel)]="form.icerik" rows="4"></textarea>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary" (click)="cancel()">İptal</button>
        <button class="btn btn-primary" (click)="confirm()" [disabled]="!form.maddeAdi">
          <i class="bi bi-check-lg me-1"></i>Ekle
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: white;
      border-radius: 8px;
      min-width: 500px;
    }
  `]
})
export class ProsedurStandartDialogComponent {
  form = {
    maddeNo: 1,
    maddeAdi: '',
    icerik: ''
  };

  constructor(
    @Inject(DIALOG_DATA) public data: StandartDialogData,
    private readonly dialogRef: DialogRef<StandartRequest | null>
  ) {
    this.form.maddeNo = data.nextMaddeNo;
  }

  confirm(): void {
    this.dialogRef.close({
      maddeNo: this.form.maddeNo,
      maddeAdi: this.form.maddeAdi.trim(),
      icerik: this.form.icerik.trim() || undefined,
      prosedurId: this.data.prosedurId
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
