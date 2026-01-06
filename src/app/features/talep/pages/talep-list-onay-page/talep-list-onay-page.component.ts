import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable, of, catchError, map, switchMap } from 'rxjs';

import { TalepService } from 'src/app/core/services/api/talep.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TalepListComponent } from '../../components/talep-list/talep-list.component';
import { TalepOzet } from 'src/app/core/models/talep-ozet';

@Component({
  selector: 'app-talep-list-onay-page',
  templateUrl: './talep-list-onay-page.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, TalepListComponent]
})
export class TalepOnayBekleyenPageComponent implements OnInit {
  // Dependency Injection via inject()
  private talepService = inject(TalepService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected authService = inject(AuthService);

  // State management
  talepler$!: Observable<TalepOzet[]>;
  isLoading = signal(false);
  onayDurumu = signal<string>('');
  pageTitle = signal<string>('');
  pageIcon = signal<string>('bi-hourglass-split');

  ngOnInit(): void {
    this.talepler$ = this.route.paramMap.pipe(
      switchMap(params => {
        const onayKodu = params.get('onayKodu') || 'ons';
        this.onayDurumu.set(onayKodu);
        this.setPageInfo(onayKodu);
        
        return this.talepService.getByOnayDurumu(onayKodu).pipe(
        
          map(res => { 
            this.isLoading.set(false); 
            return res; 
          }),
          catchError(err => { 
            this.toastService.error('Talepler yüklenirken hata oluştu.'); 
            console.error(err); 
            this.isLoading.set(false);
            return of([] as TalepOzet[]); 
          })
        );
      })
    );
  }

  private setPageInfo(onayKodu: string): void {
    const pageInfoMap: Record<string, { title: string; icon: string }> = {
      'tas': { title: 'Taslak Talepler', icon: 'bi-file-earmark' },
      'ons': { title: 'Onay Bekleyen Talepler', icon: 'bi-hourglass-split' },
      'red': { title: 'Reddedilen Talepler', icon: 'bi-x-circle' },
      'ony': { title: 'Onaylanan Talepler', icon: 'bi-check-circle' }
    };

    const info = pageInfoMap[onayKodu] || { title: 'Talepler', icon: 'bi-envelope' };
    this.pageTitle.set(info.title);
    this.pageIcon.set(info.icon);
  }

  // Handlers for presentational component outputs
  viewDetail(id: number): void {
    this.router.navigate(['/talep/detail', id]);
  }

}
