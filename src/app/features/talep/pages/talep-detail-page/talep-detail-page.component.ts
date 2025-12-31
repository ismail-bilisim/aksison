import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepResponse } from 'src/app/core/models/talep-response';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { TalepTemelComponent } from 'src/app/features/talep/components/talep-temel/talep-temel.component';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';

@Component({
  selector: 'app-talep-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TalepTemelComponent],
  templateUrl: './talep-detail-page.component.html',
  styleUrls: ['./talep-detail-page.component.css']
})
export class TalepDetailPageComponent implements OnInit {

  talep$!: Observable<TalepResponse | null>;
  talepId!: number;
  isLoading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private talepService: TalepService,
    private kullaniciService: KullaniciService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.talep$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.talepId = id;
        if (!id) return of(null);
        return this.talepService.getById(id).pipe(
          catchError(err => { this.toastService.error('Talep yüklenirken hata oluştu.'); console.error(err); return of(null); })
        );
      })
    );

  }


  handleEdit() {
    this.router.navigate(['/talep', 'edit', this.talepId]);
  }

  handleSubmitForApproval() {
    if (this.talepId && confirm('Talebi onay için sunmak istediğinizden emin misiniz?')) {
      this.talepService.icerikOnayinaSun(this.talepId).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla onaya sunuldu.');
          // Optimistic update: refresh the talep$
          this.talep$ = this.talepService.getById(this.talepId).pipe(
            catchError(err => { console.error(err); return of(null); })
          );
        },
        error: (err) => {
          this.toastService.error('Talep onaya sunulurken hata oluştu.');
          console.error(err);
        }
      });
    }
  }

  handleApprove() {
    if (this.talepId && confirm('Talebi onaylamak istediğinizden emin misiniz?')) {
      this.talepService.icerikOnayla(this.talepId).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla onaylandı.');
          // Refresh
          this.talep$ = this.talepService.getById(this.talepId).pipe(
            catchError(err => { console.error(err); return of(null); })
          );
        },
        error: (err) => {
          this.toastService.error('Talep onaylanırken hata oluştu.');
          console.error(err);
        }
      });
    }
  }

  handleReject() {
    if (this.talepId && confirm('Talebi reddetmek istediğinizden emin misiniz?')) {
      this.talepService.icerikReddet(this.talepId).subscribe({
        next: () => {
          this.toastService.success('Talep başarıyla reddedildi.');
          // Refresh
          this.talep$ = this.talepService.getById(this.talepId).pipe(
            catchError(err => { console.error(err); return of(null); })
          );
        },
        error: (err) => {
          this.toastService.error('Talep reddedilirken hata oluştu.');
          console.error(err);
        }
      });
    }
  }

    onDelete(id: number) {
      if (!confirm('Talebi silmek istediğinizden emin misiniz?')) return;
      this.isLoading.set(true);
      this.talepService.delete(id).subscribe({
        next: () => { 
          this.toastService.success('Talep başarıyla silindi.'); 
          this.isLoading.set(false); 
          this.router.navigate(['/talep']);
        }
        ,error: (err) => { 
          this.toastService.error('Talep silinirken hata oluştu.'); 
          console.error(err); 
          this.isLoading.set(false); 
        }
      });
    }
  
  
}
