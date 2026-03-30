import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProsedurResponse } from 'src/app/core/models/prosedur-response';
import { PrensipResponse } from 'src/app/core/models/prensip-response';
import { StandartResponse } from 'src/app/core/models/standart-response';
import { PrensipRequest } from 'src/app/core/models/prensip-request';
import { StandartRequest } from 'src/app/core/models/standart-request';
import { SurecAdimResponse } from 'src/app/core/models/surec-adim-response';
import { SurecAdimRequest } from 'src/app/core/models/surec-adim-request';

@Component({
  selector: 'app-prosedur-temel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prosedur-temel.component.html',
  styleUrls: ['./prosedur-temel.component.css']
})
export class ProsedurTemelComponent {
  @Input({ required: true }) prosedur!: ProsedurResponse;

  @Output() prensipUpdate = new EventEmitter<{ id: number; request: PrensipRequest }>();
  @Output() standartUpdate = new EventEmitter<{ id: number; request: StandartRequest }>();
  @Output() prensipDelete = new EventEmitter<number>();
  @Output() standartDelete = new EventEmitter<number>();
  @Output() prensipMulga = new EventEmitter<number>();
  @Output() standartMulga = new EventEmitter<number>();
  @Output() surecAdimUpdate = new EventEmitter<{ id: number; request: SurecAdimRequest }>();
  @Output() surecAdimDelete = new EventEmitter<number>();
  @Output() surecAdimMulga = new EventEmitter<number>();

  // Inline edit state
  editingPrensipId = signal<number | null>(null);
  editingStandartId = signal<number | null>(null);
  editingSurecAdimId = signal<number | null>(null);

  // Inline edit form data
  editPrensipForm = { maddeNo: 0, maddeAdi: '', icerik: '' };
  editStandartForm = { maddeNo: 0, maddeAdi: '', icerik: '' };
  editSurecAdimForm = { maddeNo: 0, maddeAdi: '', icerik: '' };

  // ---- Prensip inline edit ----

  startEditPrensip(p: PrensipResponse): void {
    this.editingPrensipId.set(p.id);
    this.editPrensipForm = { maddeNo: p.maddeNo, maddeAdi: p.maddeAdi, icerik: p.icerik || '' };
    this.cancelEditStandart();
  }

  cancelEditPrensip(): void {
    this.editingPrensipId.set(null);
  }

  saveEditPrensip(p: PrensipResponse): void {
    this.prensipUpdate.emit({
      id: p.id,
      request: {
        version: p.version,
        maddeNo: this.editPrensipForm.maddeNo,
        maddeAdi: this.editPrensipForm.maddeAdi,
        icerik: this.editPrensipForm.icerik,
        prosedurId: this.prosedur.id
      }
    });
    this.editingPrensipId.set(null);
  }

  onDeletePrensip(id: number): void {
    this.prensipDelete.emit(id);
  }

  onMulgaPrensip(id: number): void {
    this.prensipMulga.emit(id);
  }

  // ---- Standart inline edit ----

  startEditStandart(s: StandartResponse): void {
    this.editingStandartId.set(s.id);
    this.editStandartForm = { maddeNo: s.maddeNo, maddeAdi: s.maddeAdi, icerik: s.icerik || '' };
    this.cancelEditPrensip();
  }

  cancelEditStandart(): void {
    this.editingStandartId.set(null);
  }

  saveEditStandart(s: StandartResponse): void {
    this.standartUpdate.emit({
      id: s.id,
      request: {
        version: s.version,
        maddeNo: this.editStandartForm.maddeNo,
        maddeAdi: this.editStandartForm.maddeAdi,
        icerik: this.editStandartForm.icerik,
        prosedurId: this.prosedur.id
      }
    });
    this.editingStandartId.set(null);
  }

  onDeleteStandart(id: number): void {
    this.standartDelete.emit(id);
  }

  onMulgaStandart(id: number): void {
    this.standartMulga.emit(id);
  }

  // ---- Süreç Adımı inline edit ----

  startEditSurecAdim(a: SurecAdimResponse): void {
    this.editingSurecAdimId.set(a.id);
    this.editSurecAdimForm = { maddeNo: a.maddeNo, maddeAdi: a.maddeAdi, icerik: a.icerik || '' };
    this.cancelEditPrensip();
    this.cancelEditStandart();
  }

  cancelEditSurecAdim(): void {
    this.editingSurecAdimId.set(null);
  }

  saveEditSurecAdim(a: SurecAdimResponse): void {
    this.surecAdimUpdate.emit({
      id: a.id,
      request: {
        version: a.version,
        maddeNo: this.editSurecAdimForm.maddeNo,
        maddeAdi: this.editSurecAdimForm.maddeAdi,
        icerik: this.editSurecAdimForm.icerik,
        prosedurId: this.prosedur.id
      }
    });
    this.editingSurecAdimId.set(null);
  }

  onDeleteSurecAdim(id: number): void {
    this.surecAdimDelete.emit(id);
  }

  onMulgaSurecAdim(id: number): void {
    this.surecAdimMulga.emit(id);
  }

  // ---- Helpers ----

  formatTarih(tarih: string | null): string {
    if (!tarih) return '-';
    try {
      return new Date(tarih).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return tarih;
    }
  }
}
