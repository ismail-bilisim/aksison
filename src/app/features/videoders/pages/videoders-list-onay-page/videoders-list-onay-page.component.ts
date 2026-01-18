import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable, of, catchError, map, switchMap } from 'rxjs';

import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { VideodersListComponent } from '../../components/videoders-list/videoders-list.component';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-videoders-list-onay-page',
  templateUrl: './videoders-list-onay-page.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, VideodersListComponent]
})
export class VideodersListOnayPageComponent implements OnInit {
  // Dependency Injection via inject()
  private videodersService = inject(VideodersService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected authService = inject(AuthService);

  // State management
  videodersler$!: Observable<DersOzet[]>;
  isLoading = signal(false);
  onayDurumu = signal<string>('');
  pageTitle = signal<string>('');
  pageIcon = signal<string>('bi-hourglass-split');

  ngOnInit(): void {
    this.videodersler$ = this.route.paramMap.pipe(
      switchMap(params => {
        const onayKodu = params.get('onayKodu') || 'ons';
        this.onayDurumu.set(onayKodu);
        this.setPageInfo(onayKodu);
        
        return this.videodersService.getAllByOnayDurumu(onayKodu).pipe(
        
          map(res => { 
            this.isLoading.set(false); 
            return res; 
          }),
          catchError(err => { 
            this.toastService.error('Video dersler yüklenirken hata oluştu.'); 
            console.error(err); 
            this.isLoading.set(false);
            return of([] as DersOzet[]); 
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

    const info = pageInfoMap[onayKodu] || { title: 'Video Dersler', icon: 'bi-play-circle' };
    this.pageTitle.set(info.title);
    this.pageIcon.set(info.icon);
  }

  // Handlers for presentational component outputs
  viewDetail(id: number): void {
    this.router.navigate(['/videoders/detail', id]);
  }

}
