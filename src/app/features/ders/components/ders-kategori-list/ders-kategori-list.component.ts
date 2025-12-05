import { Component, Input, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DersKategori } from '../../../../core/models/ders-kategori';
import { DersKategoriService } from '../../../../core/services/api/ders-kategori.service';
import { KategoriService } from '../../../../core/services/api/kategori.service';
import { Kategori } from '../../../../core/models/kategori';

@Component({
  selector: 'app-ders-kategori-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule, NgbDropdownModule],
  templateUrl: './ders-kategori-list.component.html',
  styleUrls: ['./ders-kategori-list.component.css']
})
export class DersKategoriListComponent implements OnInit {
  @Input() dersId!: number;
  @ViewChild('kategoriModal') kategoriModalTemplate!: TemplateRef<any>;
  items: DersKategori[] = [];
  loading = false;
  deleting = false;
  
  // Modal ile ilgili özellikler
  availableKategoriler: Kategori[] = [];
  selectedKategoriler: number[] = [];
  modalLoading = false;
  adding = false;
  
  private dersKategoriService = inject(DersKategoriService);
  private kategoriService = inject(KategoriService);
  private modalService = inject(NgbModal);

  ngOnInit() {
    if (this.dersId) {
      this.loadKategoriOzet();
    }
  }

  loadKategoriOzet() {
    this.loading = true;
    this.dersKategoriService.getKategoriOzetByDersId(this.dersId)
      .subscribe({
        next: (data) => {
          console.log('Kategori verileri:', data);
          this.items = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Kategori özet yüklenirken hata:', error);
          this.loading = false;
        }
      });
  }

  onDelete(item: DersKategori) {
    if (!item.id && !item.kategoriId) {
      console.error('Kategori ID bulunamadı');
      return;
    }

    if (!confirm(`"${item.adi}" kategorisini kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    this.deleting = true;
    const kategoriId = item.id || item.kategoriId!;
    
    this.dersKategoriService.deleteKategori(this.dersId, kategoriId)
      .subscribe({
        next: () => {
          this.items = this.items.filter(i => (i.id || i.kategoriId) !== kategoriId);
          this.deleting = false;
        },
        error: (error) => {
          console.error('Kategori silinirken hata:', error);
          alert('Kategori silinirken bir hata oluştu.');
          this.deleting = false;
        }
      });
  }

  onAdd() {
    this.loadAvailableKategoriler();
  }

  loadAvailableKategoriler() {
    this.modalLoading = true;
    this.kategoriService.getAll().subscribe({
      next: (data) => {
        // Mevcut kategorileri filtrele
        const mevcutKategoriIds = this.items.map(item => item.kategoriId || item.id);
        this.availableKategoriler = data.filter(kategori => 
          !mevcutKategoriIds.includes(kategori.id!)
        );
        this.selectedKategoriler = [];
        this.modalLoading = false;
        
        // Modal'ı kategoriler yüklendikten sonra aç
        this.openKategoriModal();
      },
      error: (error) => {
        console.error('Kategoriler yüklenirken hata:', error);
        this.modalLoading = false;
        alert('Kategoriler yüklenirken bir hata oluştu.');
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

    this.adding = true;
    const requests = this.selectedKategoriler.map(kategoriId =>
      this.dersKategoriService.addKategori(this.dersId, kategoriId)
    );

    // Tüm istekleri paralel olarak gönder
    Promise.all(requests.map(req => req.toPromise())).then(() => {
      this.loadKategoriOzet();
      this.adding = false;
      this.modalService.dismissAll();
    }).catch(error => {
      console.error('Kategoriler eklenirken hata:', error);
      alert('Kategoriler eklenirken bir hata oluştu.');
      this.adding = false;
    });
  }
}
