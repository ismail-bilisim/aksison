import { Component, Input, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProjeOzet } from '../../../../core/models/proje-ozet';
import { VideodersProjeService } from '../../../../core/services/api/videoders-proje.service';
import { ProjeService } from '../../../../core/services/api/proje.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';

@Component({
  selector: 'app-videoders-proje-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './videoders-proje-list.component.html',
  styleUrl: './videoders-proje-list.component.css'
})
export class VideodersProjeListComponent implements OnInit {
  @Input() dersId!: number;
  @ViewChild('projeModal') projeModalTemplate!: TemplateRef<any>;
  
  items: ProjeOzet[] = [];
  loading = false;
  deleting = false;
  
  // Modal ile ilgili özellikler
  availableProjeler: ProjeOzet[] = [];
  selectedProjeler: number[] = [];
  modalLoading = false;
  adding = false;
  
  private videodersProjeService = inject(VideodersProjeService);
  private projeService = inject(ProjeService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);
  private router = inject(Router);

  ngOnInit() {
    if (this.dersId) {
      this.loadProjeOzet();
    }
  }

  loadProjeOzet() {
    this.loading = true;
    this.videodersProjeService.getByDersId(this.dersId)
      .subscribe({
        next: (data) => {
          console.log('Proje verileri:', data);
          this.items = data;
          this.loading = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadProjeOzet');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.loading = false;
        }
      });
  }

  onDelete(item: ProjeOzet) {
    if (!item.id) {
      console.error('Proje ID bulunamadı');
      return;
    }

    if (!confirm(`"${item.projeAdi}" projesini kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    this.deleting = true;
    
    this.videodersProjeService.deleteProje(this.dersId, item.id)
      .subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== item.id);
          this.toastService.success('Proje başarıyla kaldırıldı.');
          this.deleting = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteProje');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.deleting = false;
        }
      });
  }

  onAdd() {
    this.loadAvailableProjeler();
  }

  loadAvailableProjeler() {
    this.modalLoading = true;
    this.projeService.getAllOzet().subscribe({
      next: (data) => {
        // Mevcut projeleri filtrele
        const mevcutProjeIds = new Set(this.items.map(item => item.id));
        this.availableProjeler = data.filter(proje => 
          !mevcutProjeIds.has(proje.id)
        );
        this.selectedProjeler = [];
        this.modalLoading = false;
        
        // Modal'ı projeler yüklendikten sonra aç
        this.openProjeModal();
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadAvailableProjeler');
        this.modalLoading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  openProjeModal() {
    if (this.projeModalTemplate) {
      this.modalService.open(this.projeModalTemplate, { size: 'lg' });
    }
  }

  toggleProjeSelection(projeId: number) {
    const index = this.selectedProjeler.indexOf(projeId);
    if (index > -1) {
      this.selectedProjeler.splice(index, 1);
    } else {
      this.selectedProjeler.push(projeId);
    }
  }

  isProjeSelected(projeId: number): boolean {
    return this.selectedProjeler.includes(projeId);
  }

  addSelectedProjeler() {
    if (this.selectedProjeler.length === 0) {
      return;
    }

    this.adding = true;
    const requests = this.selectedProjeler.map(projeId =>
      this.videodersProjeService.addProje(this.dersId, projeId)
    );

    // Tüm istekleri paralel olarak gönder
    Promise.all(requests.map(req => firstValueFrom(req))).then(() => {
      this.toastService.success('Projeler başarıyla eklendi.');
      this.loadProjeOzet();
      this.adding = false;
      this.modalService.dismissAll();
    }).catch(error => {
      ErrorHandler.logError(error, 'addSelectedProjeler');
      this.toastService.error(ErrorHandler.extractErrorMessage(error));
      this.adding = false;
    });
  }

  navigateToProje(projeId: number) {
    this.router.navigate(['/proje', projeId]);
  }

  getOnayDurumuBadgeClass(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'bg-warning';
      case 'ons': return 'bg-info';
      case 'red': return 'bg-danger';
      case 'ony': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getOnayDurumuText(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'Taslak';
      case 'ons': return 'Onay Bekliyor';
      case 'red': return 'Reddedildi';
      case 'ony': return 'Onaylandı';
      default: return onayDurumu;
    }
  }
}
