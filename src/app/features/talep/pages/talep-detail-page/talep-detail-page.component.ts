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
import { ROLES } from 'src/app/core/config/roles';
import { IslemKayitListComponent } from 'src/app/shared/components/islem-kayit-list/islem-kayit-list.component';
import { TalepIslemkayit } from 'src/app/core/models/talep-islemkayit';
import { TalepEkDosyaListComponent as TalepEkdosyaListComponent } from '../../components/talep-ekdosya-list/talep-ekdosya-list.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-talep-detail-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TalepTemelComponent, 
    FormsModule,
    NgbNavModule,
    TalepEkdosyaListComponent,
    IslemKayitListComponent
  ],

  templateUrl: './talep-detail-page.component.html',
  styleUrls: ['./talep-detail-page.component.css']
})
export class TalepDetailPageComponent implements OnInit {

  // Dependency Injection via inject()
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly talepService = inject(TalepService);
  private readonly toastService = inject(ToastService);
  protected readonly authService = inject(AuthService);

  public readonly ROLES = ROLES;

  // State
  talep$!: Observable<TalepResponse | null>;
  talepId!: number;
  isLoading = signal(false);
  
  // Tab state
  activeTab = signal<number>(1); // 1: Files, 2: Operation Logs
  
  // İşlem kayıtları için
  talepIslemKayitlar = signal<TalepIslemkayit[]>([]);
  talepIslemKayitLoading = signal(false);
  talepIslemKayitLoaded = signal(false);
  
  // Assignment state
  assignableUsers$ = signal<KullaniciOzet[]>([]);
  selectedUserId = signal<number | null>(null);
  showAssignModal = signal(false);
  
  // Approval/Rejection modal state
  showApprovalModal = signal(false);
  showIptalModal = signal(false);
  showSonucModal = signal(false);
  approvalAction = signal<'approve' | 'reject'>('approve');
  approvalComment = signal<string>('');
  iptalAciklama = signal<string>('');
  sonucAciklama = signal<string>('');

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
    if (this.authService.hasRole(ROLES.TAKLI)) {
      this.talepService.getAssignableUsers().subscribe({
        next: (users) => this.assignableUsers$.set(users),
        error: (err) => console.error('Atanabilir kullanıcılar yüklenemedi:', err)
      });
    }
  }

  onTabChange(tabId: number): void {
    this.activeTab.set(tabId);
    if (tabId === 2 && !this.talepIslemKayitLoaded()) {
      this.loadTalepIslemKayitlar();
    }
  }

  private loadTalepIslemKayitlar(): void {
    if (!this.talepId || this.talepIslemKayitLoaded()) return;
    
    this.talepIslemKayitLoaded.set(true);
    this.talepIslemKayitLoading.set(true);
    this.talepService.getByTalepId(this.talepId).subscribe({
      next: (data) => {
        this.talepIslemKayitlar.set(data);
        this.talepIslemKayitLoading.set(false);
      },
      error: (error) => {
        console.error('İşlem kayıtları yüklenirken hata oluştu:', error);
        this.talepIslemKayitLoading.set(false);
      }
    });
  }

  private refreshTalep(): void {
    this.talep$ = this.talepService.getById(this.talepId).pipe(
      catchError(err => { console.error(err); return of(null); })
    );
  }

  edit(): void {
    this.router.navigate(['/talep', 'edit', this.talepId]);
  }

  submitForApproval(): void {
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

  onayla(): void {
    // Modal aç - onay için
    this.approvalAction.set('approve');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  reddet(): void {
    // Modal aç - red için
    this.approvalAction.set('reject');
    this.approvalComment.set('');
    this.showApprovalModal.set(true);
  }

  closeApprovalModal(): void {
    this.showApprovalModal.set(false);
    this.approvalComment.set('');
  }

  closeIptalModal(): void {
    this.showIptalModal.set(false);
    this.iptalAciklama.set('');
  }

  closeSonucModal(): void {
    this.showSonucModal.set(false);
    this.sonucAciklama.set('');
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


    confirmIptalAction(): void {
    if (!this.talepId) return;
    
    const comment = this.iptalAciklama();
    
    this.isLoading.set(true);
    
      this.talepService.iptalEt(this.talepId, comment || undefined).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla iptal edildi.');
          this.isLoading.set(false);
          this.closeIptalModal();
          this.refreshTalep();
        },
        error: (err) => {
          this.toastService.error('Talep iptal edilirken hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });

    }

    confirmSonucAction(): void {
    if (!this.talepId) return;
    
    const comment = this.sonucAciklama();
    
    this.isLoading.set(true);
    
      this.talepService.talepSonuclandir(this.talepId, comment || undefined).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla sonuçlandırıldı.');
          this.isLoading.set(false);
          this.closeSonucModal();
          this.refreshTalep();
        },
        error: (err) => {
          this.toastService.error('Talep sonuçlandırılırken hata oluştu.');
          console.error(err);
          this.isLoading.set(false);
        }
      });

    }

  /**
   * Kendine ata (PRJYN için)
   */
  assignToSelf(): void {
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

  delete(id: number): void {
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


    iptalEt(): void {
    
    // Modal aç - iptal için
    this.iptalAciklama.set('');
    this.showIptalModal.set(true);
  }

  

    sonuclandir(): void {
    // Modal aç - sonuç için
    this.sonucAciklama.set('');
    this.showSonucModal.set(true);
  }


}
