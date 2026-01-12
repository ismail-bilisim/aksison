import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EgitmenResponse } from '../../../../core/models/egitmen-response';
import { EgitmenService } from 'src/app/core/services/api/egitmen.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ROLES } from 'src/app/core/config/roles';
import { EgitmenTemelComponent } from '../../components/egitmen-temel/egitmen-temel.component';

@Component({
  selector: 'app-egitmen-detail-page',
  imports: [CommonModule, RouterModule, FormsModule, NgbNavModule, NgbModalModule, EgitmenTemelComponent],
  templateUrl: './egitmen-detail-page.component.html',
  styleUrl: './egitmen-detail-page.component.css'
})
export class EgitmenDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly egitmenService = inject(EgitmenService);
  private readonly toastService = inject(ToastService);
  protected readonly authService = inject(AuthService);

  public readonly ROLES = ROLES;

  egitmen$!: Observable<EgitmenResponse | null>;
  egitmenId!: number;
  isLoading = signal(false);

  activeTab = signal<number>(1);

  showApprovalModal = signal(false);
  approvalAction = signal<'approve' | 'reject'>('approve');
  approvalComment = signal<string>('');

  ngOnInit(): void {
    this.egitmen$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.egitmenId = id;
        if (!id) return of(null);
        return this.egitmenService.getFullById(id).pipe(
          catchError(err => {
            this.toastService.error('Eğitmen yüklenirken hata oluştu.');
            console.error(err);
            return of(null);
          })
        );
      })
    );
  }

  onTabChange(tabId: number): void {
    this.activeTab.set(tabId);
  }

  private refreshEgitmen(): void {
    this.egitmen$ = this.egitmenService.getFullById(this.egitmenId).pipe(
      catchError(err => { console.error(err); return of(null); })
    );
  }

  edit(): void {
    this.router.navigate(['/egitmen/edit', this.egitmenId]);
  }

  submitForApproval(): void {
    if (this.egitmenId && confirm('Eğitmeni onay için sunmak istediğinizden emin misiniz?')) {
      this.isLoading.set(true);
      this.egitmenService.icerikOnayinaSun(this.egitmenId).subscribe({
        next: () => {
          this.toastService.success('Eğitmen başarıyla onaya sunuldu.');
          this.isLoading.set(false);
          this.refreshEgitmen();
        },
        error: (err) => {
          this.toastService.error('Eğitmen onaya sunulurken hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }

  onayla(): void {
    this.approvalAction.set('approve');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  reddet(): void {
    this.approvalAction.set('reject');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  closeApprovalModal(): void {
    this.showApprovalModal.set(false);
    this.approvalComment.set('');
  }

  confirmApproval(): void {
    if (this.approvalAction() === 'approve') {
      this.handleApprove();
    } else {
      this.handleReject();
    }
  }

  private handleApprove(): void {
    this.isLoading.set(true);
    this.egitmenService.icerikOnayla(this.egitmenId, this.approvalComment()).subscribe({
      next: () => {
        this.toastService.success('Eğitmen başarıyla onaylanmıştır.');
        this.closeApprovalModal();
        this.isLoading.set(false);
        this.refreshEgitmen();
      },
      error: (err) => {
        this.toastService.error('Onay işlemi sırasında hata oluştu.');
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  private handleReject(): void {
    this.isLoading.set(true);
    this.egitmenService.icerikReddet(this.egitmenId, this.approvalComment()).subscribe({
      next: () => {
        this.toastService.success('Eğitmen reddedilmiştir.');
        this.closeApprovalModal();
        this.isLoading.set(false);
        this.refreshEgitmen();
      },
      error: (err) => {
        this.toastService.error('Red işlemi sırasında hata oluştu.');
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  pasifYap(): void {
    if (confirm('Eğitmeni pasif yapmak istediğinizden emin misiniz?')) {
      this.isLoading.set(true);
      this.egitmenService.pasifYap(this.egitmenId).subscribe({
        next: () => {
          this.toastService.success('Eğitmen pasif yapıldı.');
          this.isLoading.set(false);
          this.refreshEgitmen();
        },
        error: (err) => {
          this.toastService.error('Pasif yapma işlemi sırasında hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }

  aktifYap(): void {
    if (confirm('Eğitmeni aktif yapmak istediğinizden emin misiniz?')) {
      this.isLoading.set(true);
      this.egitmenService.aktifYap(this.egitmenId).subscribe({
        next: () => {
          this.toastService.success('Eğitmen aktif yapıldı.');
          this.isLoading.set(false);
          this.refreshEgitmen();
        },
        error: (err) => {
          this.toastService.error('Aktif yapma işlemi sırasında hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }
}
