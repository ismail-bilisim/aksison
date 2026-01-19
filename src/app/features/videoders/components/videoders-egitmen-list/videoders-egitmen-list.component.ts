import { Component, Input, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EgitmenOzet } from '../../../../core/models/egitmen-ozet';
import { VideodersEgitmenService } from '../../../../core/services/api/videoders-egitmen.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { EgitmenService } from '../../../../core/services/api/egitmen.service';

@Component({
  selector: 'app-videoders-egitmen-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './videoders-egitmen-list.component.html',
  styleUrls: ['./videoders-egitmen-list.component.css'],
})
export class VideodersEgitmenListComponent {
  @Input({ required: true }) dersId!: number;
  @Input() canAssign = false;
  @ViewChild('egitmenModal') egitmenModal!: TemplateRef<any>;

  egitmenler: EgitmenOzet[] = [];
  isLoading = false;
  private hasLoaded = false;

  assignLoading = false;
  availableLoading = false;
  searchTerm = '';
  availableEgitmenler: EgitmenOzet[] = [];
  filteredEgitmenler: EgitmenOzet[] = [];
  selectedEgitmenIds: number[] = [];

  private readonly videodersEgitmenService = inject(VideodersEgitmenService);
  private readonly toastService = inject(ToastService);
  private readonly egitmenService = inject(EgitmenService);
  private readonly modalService = inject(NgbModal);

  loadEgitmenler(): void {
    if (this.hasLoaded) {
      return;
    }

    this.isLoading = true;
    this.videodersEgitmenService.getByDersId(this.dersId).subscribe({
      next: (data) => {
        this.egitmenler = data;
        this.isLoading = false;
        this.hasLoaded = true;
      },
      error: (error) => {
        console.error('Eğitmenler yüklenirken hata oluştu:', error);
        this.toastService.error('Eğitmenler yüklenirken hata oluştu');
        this.isLoading = false;
      }
    });
  }

  openAssign(): void {
    if (!this.canAssign) {
      return;
    }
    this.selectedEgitmenIds = [];
    this.searchTerm = '';
    this.searchAvailable();
    this.modalService.open(this.egitmenModal, { centered: true, size: 'lg' });
  }

  searchAvailable(): void {
    this.availableLoading = true;
    this.egitmenService.searchApproved(this.searchTerm).subscribe({
      next: (data) => {
        this.availableEgitmenler = data || [];
        this.filteredEgitmenler = this.availableEgitmenler.filter(e => !this.egitmenler.some(existing => existing.id === e.id));
        this.availableLoading = false;
      },
      error: (error) => {
        console.error('Onaylı eğitmenler yüklenirken hata oluştu:', error);
        this.toastService.error('Onaylı eğitmenler yüklenemedi');
        this.availableLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.searchAvailable();
  }

  toggleSelect(id: number): void {
    if (this.selectedEgitmenIds.includes(id)) {
      this.selectedEgitmenIds = this.selectedEgitmenIds.filter(x => x !== id);
    } else {
      this.selectedEgitmenIds = [...this.selectedEgitmenIds, id];
    }
  }

  assignSelected(): void {
    if (this.selectedEgitmenIds.length === 0) {
      return;
    }
    this.assignLoading = true;
    const requests = this.selectedEgitmenIds.map(id =>
      this.videodersEgitmenService.addEgitmen(this.dersId, id)
    );

    let completed = 0;
    requests.forEach(req => {
      req.subscribe({
        next: () => {
          completed++;
          if (completed === requests.length) {
            this.toastService.success('Eğitmen(ler) başarıyla atandı');
            this.assignLoading = false;
            this.modalService.dismissAll();
            this.refreshEgitmenler();
          }
        },
        error: (error) => {
          console.error('Eğitmen atama hatası:', error);
          this.toastService.error('Eğitmen atama başarısız');
          this.assignLoading = false;
        }
      });
    });
  }

  removeEgitmen(id: number): void {
    if (!id) return;
    this.isLoading = true;
    this.videodersEgitmenService.deleteEgitmen(this.dersId, id).subscribe({
      next: () => {
        this.toastService.success('Eğitmen kaldırıldı');
        this.egitmenler = this.egitmenler.filter(e => e.id !== id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Eğitmen kaldırma hatası:', error);
        this.toastService.error('Eğitmen kaldırma başarısız');
        this.isLoading = false;
      }
    });
  }

  private refreshEgitmenler(): void {
    this.hasLoaded = false;
    this.loadEgitmenler();
  }
}
