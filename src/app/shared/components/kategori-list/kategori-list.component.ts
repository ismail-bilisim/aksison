import { Component, Input, Output, EventEmitter, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { KategoriOzet } from '../../../core/models/kategori-ozet';
import { KategoriService } from '../../../core/services/api/kategori.service';
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
  
  @Output() add = new EventEmitter<number[]>();
  @Output() delete = new EventEmitter<number>();
  
  @ViewChild('kategoriModal') kategoriModalTemplate!: TemplateRef<any>;
  
  // Modal ile ilgili özellikler
  availableKategoriler: Kategori[] = [];
  selectedKategoriler: number[] = [];
  modalLoading = false;
  
  private readonly kategoriService = inject(KategoriService);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

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
    this.loadAvailableKategoriler();
  }

  loadAvailableKategoriler() {
    this.modalLoading = true;
    this.kategoriService.getAll().subscribe({
      next: (data) => {
        // Mevcut kategorileri filtrele
        const mevcutKategoriIds = new Set(this.items.map(item => item.id));
        this.availableKategoriler = data.filter(kategori => 
          !mevcutKategoriIds.has(kategori.id!)
        );
        this.selectedKategoriler = [];
        this.modalLoading = false;
        
        // Modal'ı kategoriler yüklendikten sonra aç
        this.openKategoriModal();
      },
      error: (error) => {
        console.error('loadAvailableKategoriler error:', error);
        this.modalLoading = false;
      }
    });
  }

  openKategoriModal() {
    if (this.kategoriModalTemplate) {
      this.modalService.open(this.kategoriModalTemplate, { size: 'lg' });
    }
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

    this.add.emit(this.selectedKategoriler);
    this.modalService.dismissAll();
    this.selectedKategoriler = [];
  }

  navigateToKategori(kategoriId: number) {
    this.router.navigate(['/kategori', 'detail', kategoriId]);
  }
}
