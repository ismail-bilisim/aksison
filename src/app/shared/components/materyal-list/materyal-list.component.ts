import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DersMateryalResponse } from '../../../core/models/ders-materyal-response';
import { MedyaTuruOzet } from '../../../core/models/medya-turu-ozet';

@Component({
  selector: 'app-materyal-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './materyal-list.component.html',
  styleUrls: ['./materyal-list.component.css']
})
export class MateryalListComponent {
  @Input() items: DersMateryalResponse[] = [];
  @Input() isLoading = false;
  @Input() isDeleting = false;
  @Input() isUploading = false;
  @Input() modalLoading = false;
  @Input() availableMedyaTurleri: MedyaTuruOzet[] = [];
  @Input() canModify = false;

  @Output() addRequested = new EventEmitter<void>();
  @Output() uploadConfirmed = new EventEmitter<{ file: File; medyaTuruId: number }>();
  @Output() delete = new EventEmitter<number>();
  @Output() download = new EventEmitter<number>();

  @ViewChild('materyalModal') materyalModalTemplate!: TemplateRef<any>;

  selectedFile: File | null = null;
  selectedMedyaTuruId: number | null = null;

  constructor(private readonly modalService: NgbModal) {}

  onAdd(): void {
    this.selectedFile = null;
    this.selectedMedyaTuruId = null;
    this.addRequested.emit();
  }

  openModal(): void {
    if (this.materyalModalTemplate) {
      this.modalService.open(this.materyalModalTemplate, { size: 'lg' });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files.item(0);
    }
  }

  onMedyaTuruChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedMedyaTuruId = select.value ? +select.value : null;
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.selectedMedyaTuruId) return;
    this.uploadConfirmed.emit({
      file: this.selectedFile,
      medyaTuruId: this.selectedMedyaTuruId
    });
  }

  onDelete(item: DersMateryalResponse): void {
    if (!item.id) { return; }
    if (!confirm(`"${item.dosyaAdi}" dosyasını silmek istediğinizden emin misiniz?`)) return;
    this.delete.emit(item.id);
  }

  onDownload(item: DersMateryalResponse): void {
    if (!item.id) { return; }
    this.download.emit(item.id);
  }

  get isFormValid(): boolean {
    return this.selectedFile !== null && this.selectedMedyaTuruId !== null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getMimeIcon(mimeType: string): string {
    if (!mimeType) return 'bi-file-earmark';
    if (mimeType.includes('pdf')) return 'bi-file-earmark-pdf';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'bi-file-earmark-slides';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'bi-file-earmark-spreadsheet';
    if (mimeType.includes('image')) return 'bi-file-earmark-image';
    return 'bi-file-earmark';
  }
}
