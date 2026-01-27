import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { KategoriOzet } from '../../../core/models/kategori-ozet';
import { Kategori } from '../../../core/models/kategori';

@Component({
  selector: 'app-kategori-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule, NgbDropdownModule],
  templateUrl: './kategori-list.component.html',
  styleUrls: ['./kategori-list.component.css']
})
export class KategoriListComponent {
  @Input() items: KategoriOzet[] = [];
  @Input() isLoading = false;
  @Input() isDeleting = false;
  @Input() isAdding = false;
  @Input() modalLoading = false;
  @Input() availableKategoriler: Kategori[] = [];
  
  @Output() addRequested = new EventEmitter<void>();
  @Output() addConfirmed = new EventEmitter<number[]>();
  @Output() delete = new EventEmitter<number>();
  @Output() kategoriSelected = new EventEmitter<number>();
  
  @ViewChild('kategoriModal') kategoriModalTemplate!: TemplateRef<any>;
  
  selectedKategoriler: number[] = [];
  
  constructor(private readonly modalService: NgbModal) {}

  onDelete(item: KategoriOzet) {
    if (!item.id) {
      console.error('Kategori ID bulunamadı');
      return;
    }

    if (!confirm(`"${item.adi}" kategorisini kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    this.delete.emit(item.id);
  }

  onAdd() {
    this.selectedKategoriler = [];
    this.addRequested.emit();
  }

  openKategoriModal() {
    if (this.kategoriModalTemplate) {
      this.modalService.open(this.kategoriModalTemplate, { size: 'lg' });
    }
  }

  closeKategoriModal() {
    this.modalService.dismissAll();
  }

  toggleKategoriSelection(kategoriId: number) {
    const index = this.selectedKategoriler.indexOf(kategoriId);
    if (index > -1) {
      this.selectedKategoriler.splice(index, 1);
    } else {
      this.selectedKategoriler.push(kategoriId);
    }
  }

  isKategoriSelected(kategoriId: number): boolean {
    return this.selectedKategoriler.includes(kategoriId);
  }

  addSelectedKategoriler() {
    if (this.selectedKategoriler.length === 0) {
      return;
    }

    this.addConfirmed.emit(this.selectedKategoriler);
    this.modalService.dismissAll();
    this.selectedKategoriler = [];
  }

  onSelect(item: KategoriOzet) {
    if (item.id) {
      this.kategoriSelected.emit(item.id);
    }
  }
}
