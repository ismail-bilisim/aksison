import { Component, Input, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PaydasOzet } from '../../../../core/models/paydas-ozet';
import { VideodersPaydasService } from '../../../../core/services/api/videoders-paydas.service';
import { PaydasService } from '../../../../core/services/api/paydas.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';

@Component({
  selector: 'app-videoders-paydas-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './videoders-paydas-list.component.html',
  styleUrl: './videoders-paydas-list.component.css'
})
export class VideodersPaydasListComponent implements OnInit {
  @Input() dersId!: number;
  @ViewChild('paydasModal') paydasModalTemplate!: TemplateRef<any>;
  
  items: PaydasOzet[] = [];
  loading = false;
  deleting = false;
  
  // Modal ile ilgili özellikler
  availablePaydaslar: PaydasOzet[] = [];
  selectedPaydaslar: number[] = [];
  modalLoading = false;
  adding = false;
  
  private videodersPaydasService = inject(VideodersPaydasService);
  private paydasService = inject(PaydasService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);
  private router = inject(Router);

  ngOnInit() {
    if (this.dersId) {
      this.loadPaydasOzet();
    }
  }

  loadPaydasOzet() {
    this.loading = true;
    this.videodersPaydasService.getByDersId(this.dersId)
      .subscribe({
        next: (data) => {
          console.log('Paydaş verileri:', data);
          this.items = data;
          this.loading = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'loadPaydasOzet');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.loading = false;
        }
      });
  }

  onDelete(item: PaydasOzet) {
    if (!item.id) {
      console.error('Paydaş ID bulunamadı');
      return;
    }

    if (!confirm(`"${item.adi}" paydaşını kaldırmak istediğinizden emin misiniz?`)) {
      return;
    }

    this.deleting = true;
    
    this.videodersPaydasService.deletePaydas(this.dersId, item.id)
      .subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== item.id);
          this.toastService.success('Paydaş başarıyla kaldırıldı.');
          this.deleting = false;
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deletePaydas');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
          this.deleting = false;
        }
      });
  }

  onAdd() {
    this.loadAvailablePaydaslar();
  }

  loadAvailablePaydaslar() {
    this.modalLoading = true;
    this.paydasService.getAll().subscribe({
      next: (data) => {
        // Mevcut paydaşları filtrele
        const mevcutPaydasIds = new Set(this.items.map(item => item.id));
        this.availablePaydaslar = data.filter(paydas => 
          !mevcutPaydasIds.has(paydas.id)
        );
        this.selectedPaydaslar = [];
        this.modalLoading = false;
        
        // Modal'ı paydaşlar yüklendikten sonra aç
        this.openPaydasModal();
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadAvailablePaydaslar');
        this.modalLoading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  openPaydasModal() {
    if (this.paydasModalTemplate) {
      this.modalService.open(this.paydasModalTemplate, { size: 'lg' });
    }
  }

  togglePaydasSelection(paydasId: number) {
    const index = this.selectedPaydaslar.indexOf(paydasId);
    if (index > -1) {
      this.selectedPaydaslar.splice(index, 1);
    } else {
      this.selectedPaydaslar.push(paydasId);
    }
  }

  isPaydasSelected(paydasId: number): boolean {
    return this.selectedPaydaslar.includes(paydasId);
  }

  addSelectedPaydaslar() {
    if (this.selectedPaydaslar.length === 0) {
      return;
    }

    this.adding = true;
    const requests = this.selectedPaydaslar.map(paydasId =>
      this.videodersPaydasService.addPaydas(this.dersId, paydasId)
    );

    // Tüm istekleri paralel olarak gönder
    Promise.all(requests.map(req => firstValueFrom(req))).then(() => {
      this.toastService.success('Paydaşlar başarıyla eklendi.');
      this.loadPaydasOzet();
      this.adding = false;
      this.modalService.dismissAll();
    }).catch(error => {
      ErrorHandler.logError(error, 'addSelectedPaydaslar');
      this.toastService.error(ErrorHandler.extractErrorMessage(error));
      this.adding = false;
    });
  }

  navigateToPaydas(paydasId: number) {
    this.router.navigate(['/paydas', paydasId]);
  }
}
