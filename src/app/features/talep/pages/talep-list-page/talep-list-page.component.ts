import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalepListComponent } from '../../components/talep-list/talep-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, catchError, Observable } from 'rxjs';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepOzet } from 'src/app/core/models/talep-ozet';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-talep-list-page',
  templateUrl: './talep-list-page.component.html',
  styleUrls: ['./talep-list-page.component.css'],
  standalone: true,
  imports: [CommonModule, TalepListComponent, ReactiveFormsModule, RouterModule]
})
export class TalepListPageComponent {
  // Dependency Injection via inject()
  private talepService = inject(TalepService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // State management
  talepler$: Observable<TalepOzet[]>;
  isLoading = signal(false);

  constructor() {

    this.isLoading.set(true);
    this.talepler$ = this.talepService.getAllOzet().pipe(
          catchError(err => { 
            this.toastService.error('Talepler yüklenirken hata oluştu.'); 
            console.error(err); 
            return of([] as TalepOzet[]); 
          })
    );

    this.isLoading.set(false);
    
  }

  // Handlers for presentational component outputs
  viewDetail(id: number): void {
    this.router.navigate(['/talep/detail', id]);
  }


}

