import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepResponse } from 'src/app/core/models/talep-response';
import { KullaniciOzet } from 'src/app/core/models/kullanici-ozet';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { TalepTemelComponent } from 'src/app/features/talep/components/talep-temel/talep-temel.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-talep-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TalepTemelComponent, FormsModule],
  templateUrl: './talep-detail-page.component.html',
  styleUrls: ['./talep-detail-page.component.css']
})
export class TalepDetailPageComponent implements OnInit {

  // Dependency Injection via inject()
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private talepService = inject(TalepService);
  private toastService = inject(ToastService);
  protected authService = inject(AuthService);

  // State
  talep$!: Observable<TalepResponse | null>;
  talepId!: number;
  isLoading = signal(false);
  
  // Assignment state
  assignableUsers$ = signal<KullaniciOzet[]>([]);
  selectedUserId = signal<number | null>(null);
  showAssignModal = signal(false);
  
  // Approval/Rejection modal state
  showApprovalModal = signal(false);
  approvalAction = signal<'approve' | 'reject'>('approve');
  approvalComment = signal<string>('');

  ngOnInit(): void {
    this.talep$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.talepId = id;
        if (!id) return of(null);
        return this.talepService.getById(id).pipe(
          catchError(err => { 
            this.toastService.error('Talep yüklenirken hata oluştu.'); 
            console.error(err); 
            return of(null); 
          })
        );
      })
    );

    // Load assignable users if user has permission
    if (this.authService.hasAccess('TALEP', 'ASSIGN_OTHERS')) {
      this.talepService.getAssignableUsers().subscribe({
        next: (users) => this.assignableUsers$.set(users),
        error: (err) => console.error('Atanabilir kullanıcılar yüklenemedi:', err)
      });
    }
  }

  private refreshTalep(): void {
    this.talep$ = this.talepService.getById(this.talepId).pipe(
      catchError(err => { console.error(err); return of(null); })
    );
  }

  handleEdit(): void {
    this.router.navigate(['/talep', 'edit', this.talepId]);
  }

  handleSubmitForApproval(): void {
    if (this.talepId && confirm('Talebi onay için sunmak istediğinizden emin misiniz?')) {
      this.isLoading.set(true);
      this.talepService.icerikOnayinaSun(this.talepId).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla onaya sunuldu.');
          this.isLoading.set(false);
          this.refreshTalep();
        },
        error: (err) => {
          this.toastService.error('Talep onaya sunulurken hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }

  handleApprove(): void {
    // Modal aç - onay için
    this.approvalAction.set('approve');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  handleReject(): void {
    // Modal aç - red için
    this.approvalAction.set('reject');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  closeApprovalModal(): void {
    this.showApprovalModal.set(false);
    this.approvalComment.set('');
  }

  confirmApprovalAction(): void {
    if (!this.talepId) return;
    
    const action = this.approvalAction();
    const comment = this.approvalComment();
    
    this.isLoading.set(true);
    
    if (action === 'approve') {
      this.talepService.icerikOnayla(this.talepId, comment || undefined).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla onaylandı.');
          this.isLoading.set(false);
          this.closeApprovalModal();
          this.refreshTalep();
        },
        error: (err) => {
          this.toastService.error('Talep onaylanırken hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
    } else {
      if (!comment || comment.trim() === '') {
        this.toastService.error('Red sebebi zorunludur.');
        this.isLoading.set(false);
        return;
      }
      
      this.talepService.icerikReddet(this.talepId, comment).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla reddedildi.');
          this.isLoading.set(false);
          this.closeApprovalModal();
          this.refreshTalep();
        },
        error: (err) => {
          this.toastService.error('Talep reddedilirken hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }

  /**
   * Kendine ata (PRJYN için)
   */
  handleAssignToSelf(): void {
    if (!this.talepId) return;
    if (!confirm('Talebi kendinize atamak istediğinizden emin misiniz?')) return;

    this.isLoading.set(true);
    this.talepService.assignToSelf(this.talepId).subscribe({
      next: () => {
        this.toastService.success('Talep başarıyla size atandı.');
        this.isLoading.set(false);
        this.refreshTalep();
      },
      error: (err) => {
        this.toastService.error('Talep atanırken hata oluştu.');
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Başkasına ata (TAKLI için) - Modal aç
   */
  openAssignModal(): void {
    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.selectedUserId.set(null);
  }

  handleAssignToOther(): void {
    const userId = this.selectedUserId();
    if (!this.talepId || !userId) {
      this.toastService.error('Lütfen bir kullanıcı seçin.');
      return;
    }

    this.isLoading.set(true);
    this.talepService.assignTalep(this.talepId, userId).subscribe({
      next: () => {
        this.toastService.success('Talep başarıyla atandı.');
        this.isLoading.set(false);
        this.closeAssignModal();
        this.refreshTalep();
      },
      error: (err) => {
        this.toastService.error('Talep atanırken hata oluştu.');
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  onDelete(id: number): void {
    if (!confirm('Talebi silmek istediğinizden emin misiniz?')) return;
    this.isLoading.set(true);
    this.talepService.delete(id).subscribe({
      next: () => { 
        this.toastService.success('Talep başarıyla silindi.'); 
        this.isLoading.set(false); 
        this.router.navigate(['/talep']);
      },
      error: (err) => { 
        this.toastService.error('Talep silinirken hata oluştu.'); 
        console.error(err); 
        this.isLoading.set(false); 
      }
    });
  }
}
