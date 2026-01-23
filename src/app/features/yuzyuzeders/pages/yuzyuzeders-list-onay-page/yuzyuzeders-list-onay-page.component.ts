import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable, of, catchError, map, switchMap } from 'rxjs';

import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { YuzyuzedersListComponent } from '../../components/yuzyuzeders-list/yuzyuzeders-list.component';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';

@Component({
  selector: 'app-yuzyuzeders-list-onay-page',
  standalone: true,
  templateUrl: './yuzyuzeders-list-onay-page.component.html',
  imports: [CommonModule, RouterModule, YuzyuzedersListComponent]
})
export class YuzyuzedersListOnayPageComponent implements OnInit {
  // Dependency Injection via inject()
  private readonly yuzyuzedersService = inject(YuzyuzedersService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly authService = inject(AuthService);

  // State management
  yuzyuzedersler$!: Observable<YuzyuzeDersResponse[]>;
  isLoading = signal(false);
  onayDurumu = signal<string>('');
  pageTitle = signal<string>('');
  pageIcon = signal<string>('bi-hourglass-split');

  ngOnInit(): void {
    this.yuzyuzedersler$ = this.route.paramMap.pipe(
      switchMap(params => {
        const onayKodu = params.get('onayKodu') || 'ons';
        this.onayDurumu.set(onayKodu);
        this.setPageInfo(onayKodu);
        
        return this.yuzyuzedersService.getAllByOnayKodu(onayKodu).pipe(
          map(res => { 
            this.isLoading.set(false); 
            return res; 
          }),
          catchError(err => { 
            this.toastService.error('Yüz yüze dersler yüklenirken hata oluştu.'); 
            console.error(err); 
            this.isLoading.set(false);
            return of([] as YuzyuzeDersResponse[]); 
          })
        );
      })
    );
  }

  private setPageInfo(onayKodu: string): void {
    const pageInfoMap: Record<string, { title: string; icon: string }> = {
      'tas': { title: 'Taslak Dersler', icon: 'bi-file-earmark' },
      'ons': { title: 'Onay Bekleyen Dersler', icon: 'bi-hourglass-split' },
      'red': { title: 'Reddedilen Dersler', icon: 'bi-x-circle' },
      'ony': { title: 'Onaylanan Dersler', icon: 'bi-check-circle' }
    };

    const info = pageInfoMap[onayKodu] || { title: 'Yüz Yüze Dersler', icon: 'bi-people' };
    this.pageTitle.set(info.title);
    this.pageIcon.set(info.icon);
  }

  // Handlers for presentational component outputs
  viewDetail(id: number): void {
    this.router.navigate(['/yuzyuzeders/detail', id]);
  }
}
