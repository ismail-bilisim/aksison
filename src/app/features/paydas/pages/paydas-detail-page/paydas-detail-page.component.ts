import { Component, OnInit, inject, ViewChild, TemplateRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PaydasService } from '../../../../core/services/api/paydas.service';
import { PaydasResponse } from '../../../../core/models/paydas-response';
import { PaydasRequest } from '../../../../core/models/paydas-request';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { ToastService } from '../../../../core/services/api/toast.service';
import { VideodersListComponent } from '../../../../shared/components/videoders-list/videoders-list.component';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { YuzyuzedersListComponent } from '../../../../shared/components/yuzyuzeders-list/yuzyuzeders-list.component';
import { YuzyuzedersService } from '../../../../core/services/api/yuzyuzeders.service';
import { PaydasTemelComponent } from '../../components/paydas-temel/paydas-temel.component';
import { OnayDurumu, OnayDurumuHelper } from '../../../../core/models/onay-durumu.enum';
import { DersOzet } from '../../../../core/models/ders-ozet';

@Component({
  selector: 'app-paydas-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, NgbNavModule, VideodersListComponent, YuzyuzedersListComponent, PaydasTemelComponent],
  templateUrl: './paydas-detail-page.component.html',
  styleUrls: ['./paydas-detail-page.component.css']
})
export class PaydasDetailPageComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paydasService = inject(PaydasService);
  private readonly videodersService = inject(VideodersService);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly modalService = inject(NgbModal);

  paydas?: PaydasResponse;
  loading = false;
  editMode = false;
  saving = false;
  submitting = false;
  activeTab = 'bilgiler';
  
  // Enum for template
  readonly OnayDurumu = OnayDurumu;
  readonly OnayDurumuHelper = OnayDurumuHelper;

  // Video dersler
  videodersler = signal<DersOzet[]>([]);
  videodersLoading = signal(false);
  videodersError = signal('');
  videodersLoaded = false;

  // Yüz yüze dersler
  yuzyuzedersler = signal<DersOzet[]>([]);
  yuzyuzedersLoading = signal(false);
  yuzyuzedersError = signal('');
  yuzyuzedersLoaded = false;

  // Modal referansları
  @ViewChild('onayModal') onayModalTemplate!: TemplateRef<any>;
  @ViewChild('redModal') redModalTemplate!: TemplateRef<any>;
  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !Number.isNaN(+id)) {
        this.loadPaydas(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadPaydas(id: number): void {
    this.loading = true;
    this.paydas = undefined;

    this.paydasService.getById(id).subscribe({
      next: (data) => {
        this.paydas = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadPaydas');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/paydas']);
  }

  onEdit(): void {
    this.editMode = true;
    this.router.navigate(['/paydas/edit', this.paydas?.id]);
  }

  onCancelEdit(): void {
    this.editMode = false;
  }

  onSave(paydasData: PaydasRequest): void {
    if (!this.paydas?.id) {
      return;
    }

    this.saving = true;
    this.paydasService.update(this.paydas.id, paydasData).subscribe({
      next: (updatedPaydas) => {
        this.toastService.success('Paydaş başarıyla güncellendi.');
        this.paydas = updatedPaydas;
        this.editMode = false;
        this.saving = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'updatePaydas');
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
        this.saving = false;
      }
    });
  }

  icerikOnayinaSun(): void {
    if (!this.paydas?.id || this.submitting) {
      return;
    }
    this.submitting = true;
    this.paydasService.icerikOnayinaSun(this.paydas.id).subscribe({
      next: (updated) => {
        this.paydas = updated;
        this.submitting = false;
        this.toastService.success('Paydaş başarıyla onaya gönderildi.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikOnayinaSun');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  icerikOnayla(): void {
    if (!this.paydas?.id) return;

    this.submitting = true;
    this.paydasService.icerikOnayla(this.paydas.id).subscribe({
      next: (updated) => {
        this.paydas = updated;
        this.submitting = false;
        this.toastService.success('Paydaş onaylandı.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikOnayla');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }



  icerikReddet(): void {
    if (!this.paydas?.id) return;

    this.submitting = true;
    this.paydasService.icerikReddet(this.paydas.id).subscribe({
      next: (updated) => {
        this.paydas = updated;
        this.submitting = false;
        this.toastService.info('Paydaş reddedildi.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikReddet');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  getOnayDurumuBadgeClass(onayDurumu: string): string {
    return OnayDurumuHelper.getBadgeClass(onayDurumu);
  }

  getOnayDurumuText(onayDurumu: string): string {
    return OnayDurumuHelper.getText(onayDurumu);
  }

  onTabChange(tabId: string): void {
    if (tabId === 'videodersler' && !this.videodersLoaded) {
      this.videodersLoaded = true;
      this.loadVideodersler();
    }
    if (tabId === 'yuzyuzedersler' && !this.yuzyuzedersLoaded) {
      this.yuzyuzedersLoaded = true;
      this.loadYuzyuzedersler();
    }
  }

  private loadVideodersler(): void {
    if (!this.paydas?.id) return;
    this.videodersLoading.set(true);
    this.videodersError.set('');
    this.videodersService.getAllByPaydas(this.paydas.id).subscribe({
      next: (data) => {
        this.videodersler.set(data);
        this.videodersLoading.set(false);
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadVideodersler');
        const msg = ErrorHandler.extractErrorMessage(error);
        this.videodersError.set(msg);
        this.toastService.error(msg);
        this.videodersLoading.set(false);
      }
    });
  }

  onVideodersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/videoders/detail', id]);
    }
  }

  private loadYuzyuzedersler(): void {
    if (!this.paydas?.id) return;
    this.yuzyuzedersLoading.set(true);
    this.yuzyuzedersError.set('');
    this.yuzyuzedersService.getAllByPaydas(this.paydas.id).subscribe({
      next: (data) => {
        this.yuzyuzedersler.set(data);
        this.yuzyuzedersLoading.set(false);
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadYuzyuzedersler');
        const msg = ErrorHandler.extractErrorMessage(error);
        this.yuzyuzedersError.set(msg);
        this.toastService.error(msg);
        this.yuzyuzedersLoading.set(false);
      }
    });
  }

  onYuzyuzedersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/yuzyuzeders/detail', id]);
    }
  }
}
