import { Component, OnInit, inject, ViewChild, TemplateRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjeService } from '../../../../core/services/api/proje.service';
import { ProjeResponse } from '../../../../core/models/proje-response';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { ToastService } from '../../../../core/services/api/toast.service';
import { VideodersListComponent } from '../../../../shared/components/videoders-list/videoders-list.component';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { YuzyuzedersListComponent } from '../../../../shared/components/yuzyuzeders-list/yuzyuzeders-list.component';
import { CanlidersListComponent } from '../../../../shared/components/canliders-list/canliders-list.component';
import { YuzyuzedersService } from '../../../../core/services/api/yuzyuzeders.service';
import { CanlidersService } from '../../../../core/services/api/canliders.service';
import { ProjeTemelComponent } from '../../components/proje-temel/proje-temel.component';
import { OnayDurumu } from '../../../../core/models/onay-durumu.enum';
import { DersOzet } from '../../../../core/models/ders-ozet';

@Component({
  selector: 'app-proje-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbModalModule, VideodersListComponent, YuzyuzedersListComponent, CanlidersListComponent, ProjeTemelComponent],
  templateUrl: './proje-detail-page.component.html',
  styleUrls: ['./proje-detail-page.component.css']
})
export class ProjeDetailPageComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projeService = inject(ProjeService);
  private readonly videodersService = inject(VideodersService);
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly canlidersService = inject(CanlidersService);
  private readonly modalService = inject(NgbModal);

  proje?: ProjeResponse;
  loading = false;
  submitting = false;
  activeTab = 'bilgiler';
  
  // Enum for template
  readonly OnayDurumu = OnayDurumu;

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

  // Canlı dersler
  canlidersler = signal<DersOzet[]>([]);
  canlidersLoading = signal(false);
  canlidersError = signal('');
  canlidersLoaded = false;

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

  onTabChange(tabId: string): void {
    if (tabId === 'videodersler' && !this.videodersLoaded) {
      this.videodersLoaded = true;
      this.loadVideodersler();
    }
    if (tabId === 'yuzyuzedersler' && !this.yuzyuzedersLoaded) {
      this.yuzyuzedersLoaded = true;
      this.loadYuzyuzedersler();
    }
    if (tabId === 'canlidersler' && !this.canlidersLoaded) {
      this.canlidersLoaded = true;
      this.loadCanlidersler();
    }
  }

  private loadVideodersler(): void {
    if (!this.proje?.id) return;
    this.videodersLoading.set(true);
    this.videodersError.set('');
    this.videodersService.getByProjeId(this.proje.id).subscribe({
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
    if (!this.proje?.id) return;
    this.yuzyuzedersLoading.set(true);
    this.yuzyuzedersError.set('');
    this.yuzyuzedersService.getByProjeId(this.proje.id).subscribe({
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

  private loadCanlidersler(): void {
    if (!this.proje?.id) return;
    this.canlidersLoading.set(true);
    this.canlidersError.set('');
    this.canlidersService.getByProjeId(this.proje.id).subscribe({
      next: (data) => {
        this.canlidersler.set(data);
        this.canlidersLoading.set(false);
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadCanlidersler');
        const msg = ErrorHandler.extractErrorMessage(error);
        this.canlidersError.set(msg);
        this.toastService.error(msg);
        this.canlidersLoading.set(false);
      }
    });
  }

  onCanlidersSelect(id: number): void {
    if (id) {
      this.router.navigate(['/canliders/detail', id]);
    }
  }
}
