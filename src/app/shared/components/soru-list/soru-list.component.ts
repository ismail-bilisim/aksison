import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoruVideoDersKonuResponse, SoruVideoDersKonuRequest } from 'src/app/core/models/soru-ders-konu';
import { SoruModalComponent } from 'src/app/shared/components/soru-modal/soru-modal.component';

@Component({
  selector: 'app-soru-list',
  standalone: true,
  imports: [CommonModule, SoruModalComponent],
  templateUrl: './soru-list.component.html',
  styleUrl: './soru-list.component.css'
})
export class SoruListComponent {
  @Input() dersId!: number;
  @Input() sorular: SoruVideoDersKonuResponse[] = [];
  @Input() loading = false;

  @Output() delete = new EventEmitter<SoruVideoDersKonuResponse>();
  @Output() soruSaveRequested = new EventEmitter<SoruVideoDersKonuRequest>();
  @Output() navigateDetail = new EventEmitter<number>();
  @Output() navigateEdit = new EventEmitter<number>();

  @ViewChild(SoruModalComponent) soruModal!: SoruModalComponent;

  openSoruModal(): void {
    this.soruModal.open(null);
  }

  deleteDersSoru(dersSoru: SoruVideoDersKonuResponse): void {
    const soruMetniKisa = dersSoru.soru.soruMetni.length > 50 
      ? dersSoru.soru.soruMetni.substring(0, 50) + '...' 
      : dersSoru.soru.soruMetni;
      
    if (confirm(`"${soruMetniKisa}" sorusunu dersten silmek istediğinize emin misiniz?`)) {
      this.delete.emit(dersSoru);
    }
  }

  getSoruTipiLabel(soruTipi: any): string {
    if (typeof soruTipi === 'string') {
      return soruTipi;
    }
    return soruTipi?.kod || soruTipi || '-';
  }

  navigateToSoruDetail(soruId: number): void {
    if (soruId) {
      this.navigateDetail.emit(soruId);
    }
  }

  navigateToSoruEdit(soruId: number): void {
    if (soruId) {
      this.navigateEdit.emit(soruId);
    }
  }
} 
