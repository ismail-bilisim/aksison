import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjeService } from '../../../../core/services/api/proje.service';
import { ProjeResponse } from '../../../../core/models/proje-response';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-proje-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './proje-detail-page.component.html',
  styleUrls: ['./proje-detail-page.component.css']
})
export class ProjeDetailPageComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projeService = inject(ProjeService);
  private readonly modalService = inject(NgbModal);

  proje?: ProjeResponse;
  loading = false;
  submitting = false;

  // Modal referansları
  @ViewChild('onayModal') onayModalTemplate!: TemplateRef<any>;
  @ViewChild('redModal') redModalTemplate!: TemplateRef<any>;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !Number.isNaN(+id)) {
        this.loadProje(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadProje(id: number): void {
    this.loading = true;
    this.proje = undefined;

    this.projeService.getById(id).subscribe({
      next: (data) => {
        this.proje = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadProje');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/proje']);
  }

  onEdit(): void {
    this.router.navigate(['/proje/edit', this.proje?.id]);
  }

  icerikOnayinaSun(): void {
    if (!this.proje?.id || this.submitting) {
      return;
    }
    this.submitting = true;
    this.projeService.icerikOnayinaSun(this.proje.id).subscribe({
      next: (updated) => {
        this.proje = updated;
        this.submitting = false;
        this.toastService.success('Proje başarıyla onaya gönderildi.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikOnayinaSun');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  icerikOnayla(): void {
      if (!this.proje?.id) return;

      this.submitting = true;
      this.projeService.icerikOnayla(this.proje.id).subscribe({
          next: (updated) => {
              this.proje = updated;
              this.submitting = false;
              this.toastService.success('Proje onaylandı.');
          },
          error: (error) => {
              ErrorHandler.logError(error, 'icerikOnayla');
              this.submitting = false;
              this.toastService.error(ErrorHandler.extractErrorMessage(error));
          }
      });
  }


  icerikReddet(): void {
      if (!this.proje?.id) return;

      this.submitting = true;
      this.projeService.icerikReddet(this.proje.id).subscribe({
          next: (updated) => {
              this.proje = updated;
              this.submitting = false;
              this.toastService.info('Proje reddedildi.');
          },
          error: (error) => {
              ErrorHandler.logError(error, 'icerikReddet');
              this.submitting = false;
              this.toastService.error(ErrorHandler.extractErrorMessage(error));
          }
      });
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
