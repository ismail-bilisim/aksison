import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, catchError, map } from 'rxjs';

import { TalepService } from 'src/app/core/services/api/talep.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TalepListComponent } from '../../components/talep-list/talep-list.component';
import { TalepOzet } from 'src/app/core/models/talep-ozet';

@Component({
  selector: 'app-talep-onay-bekleyen-page',
  templateUrl: './talep-onay-bekleyen-page.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, TalepListComponent]
})
export class TalepOnayBekleyenPageComponent {
  // Dependency Injection via inject()
  private talepService = inject(TalepService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  protected authService = inject(AuthService);

  // State management
  items$: Observable<TalepOzet[]>;
  isLoading = signal(false);

  constructor() {
    this.isLoading.set(true);
    this.items$ = this.talepService.getPendingApproval().pipe(
      map(res => { 
        this.isLoading.set(false); 
        return res; 
      }),
      catchError(err => { 
        this.toastService.error('Onay bekleyen talepler yüklenirken hata oluştu.'); 
        console.error(err); 
        this.isLoading.set(false);
        return of([] as TalepOzet[]); 
      })
    );
  }

  // Handlers for presentational component outputs
  viewDetail(id: number): void {
    this.router.navigate(['/talep/detail', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/talep/edit', id]);
  }
}
