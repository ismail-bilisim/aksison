import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbAccordionModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DersRequest } from 'src/app/core/models/ders-request';
import { DersService } from 'src/app/core/services/api/ders.service';
import { DersTemelComponent } from '../../components/ders-temel/ders-temel.component';
import { DersKonuListComponent } from '../../components/ders-konu-list/ders-konu-list.component';
import { DersVideodersListComponent } from '../../components/ders-videoders-list/ders-videoders-list.component';
import { DersKategoriListComponent } from '../../components/ders-kategori-list/ders-kategori-list.component';
import { DersIslemKayitListComponent } from '../../components/ders-islem-kayit-list/ders-islem-kayit-list.component';
import { DersResponse } from 'src/app/core/models/ders-response';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { ToastService } from 'src/app/core/services/api/toast.service'; 

@Component({
  selector: 'app-ders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbModalModule,
    DersTemelComponent,
    DersKonuListComponent,
    DersVideodersListComponent,
    DersKategoriListComponent,
    DersIslemKayitListComponent
  ],
  templateUrl: './ders-detail-page.component.html',
  styleUrls: ['./ders-detail-page.component.css']
})
export class DersDetailPageComponent implements OnInit {

  private toastService = inject(ToastService);

  ders?: DersResponse;
  loading = false;
  activeTab = 'temel';
  submitting = false;

  // Modal referansları
  @ViewChild('onayModal') onayModalTemplate!: TemplateRef<any>;
  @ViewChild('redModal') redModalTemplate!: TemplateRef<any>;
  
  // Modal input değerleri
  onayNotu: string = '';
  redNedeni: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dersService = inject(DersService);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.loadDers(+id);
        console.log('Loading ders with ID from params:', id);
      } else {
        // Try to get ID from snapshot as fallback
        const snapshotId = this.route.snapshot.paramMap.get('id');
        console.log('Trying snapshot ID:', snapshotId);

        if (snapshotId && !isNaN(+snapshotId)) {
          this.loadDers(+snapshotId);
        } else {
          console.error('No valid ID found in route params or snapshot');
          console.log('Full route snapshot:', this.route.snapshot);
          this.loading = false;
        }
      }
    });
  }

  loadDers(id: number): void {
    console.log('Loading ders with ID:', id);
    this.loading = true;
    this.ders = undefined;

    this.dersService.getById(id).subscribe({
      next: (data) => {
        console.log('DersDetailPageComponent - Loaded ders:', data);
        this.ders = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadDers');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  onEdit(dersId: number): void {
    if (dersId) {
      this.router.navigate(['/ders/edit', dersId]);
    }
  }

  onBack(): void {
    this.router.navigate(['/ders']);
  }

  icerikOnayinaSun(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }
    this.submitting = true;
    this.dersService.icerikOnayinaSun(this.ders.id).subscribe({
      next: (updated) => {
        this.ders = updated;
        this.submitting = false;
        this.toastService.success('Ders başarıyla onaya gönderildi.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikOnayinaSun');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  icerikOnayla(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }
    
    // Modal aç
    this.onayNotu = '';
    this.modalService.open(this.onayModalTemplate, { centered: true }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.onaylaIslemi();
        }
      },
      () => {
        // Modal dismissed (cancelled)
      }
    );
  }

  private onaylaIslemi(): void {
    if (!this.ders?.id) return;
    
    this.submitting = true;
    this.dersService.icerikOnayla(this.ders.id, this.onayNotu || undefined).subscribe({
      next: (updated) => {
        this.ders = updated;
        this.submitting = false;
        this.toastService.success(`Ders içeriği onaylandı. Ders kodu: ${updated.kodu}`);
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikOnayla');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  icerikReddet(): void {
    if (!this.ders?.id || this.submitting) {
      return;
    }
    
    // Modal aç
    this.redNedeni = '';
    this.modalService.open(this.redModalTemplate, { centered: true }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.reddetIslemi();
        }
      },
      () => {
        // Modal dismissed (cancelled)
      }
    );
  }

  private reddetIslemi(): void {
    if (!this.ders?.id) return;
    
    this.submitting = true;
    this.dersService.icerikReddet(this.ders.id, this.redNedeni || undefined).subscribe({
      next: (updated) => {
        this.ders = updated;
        this.submitting = false;
        this.toastService.info('Ders içeriği reddedildi.');
      },
      error: (error) => {
        ErrorHandler.logError(error, 'icerikReddet');
        this.submitting = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }
}
