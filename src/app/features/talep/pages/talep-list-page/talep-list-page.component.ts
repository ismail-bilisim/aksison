import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalepListComponent } from '../../components/talep-list/talep-list.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, startWith, switchMap, map, of, catchError, Observable } from 'rxjs';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepDurumuService } from 'src/app/core/services/api/talep-durumu.service';
import { TalepOzet } from 'src/app/core/models/talep-ozet';
import { TalepDurumuOzet } from 'src/app/core/models/talep-durumu';
import { getDateRange } from 'src/app/core/utils/date-filter.util';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

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
  private talepDurumuService = inject(TalepDurumuService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  protected authService = inject(AuthService);

  // State management
  items$: Observable<TalepOzet[]>;
  talepDurumlari$ = this.talepDurumuService.getAllOzet();
  isLoading = signal(false);

  // Filter controls
  talepAdiFilter = new FormControl('');
  talepDurumuFilter = new FormControl('');
  dateRangeFilter = new FormControl('bu ay');

  constructor() {
    this.items$ = combineLatest([
      this.talepAdiFilter.valueChanges.pipe(startWith('')),
      this.talepDurumuFilter.valueChanges.pipe(startWith('')),
      this.dateRangeFilter.valueChanges.pipe(startWith('bu ay'))
    ]).pipe(
      debounceTime(300),
      switchMap(([talepSonuc, durumKodu, dateRangeKey]) => {
        this.isLoading.set(true);
        const { startDate, endDate } = getDateRange(dateRangeKey || 'bu ay');

        if (durumKodu) {
          return this.talepService.getTaleplerByDurumu(durumKodu, startDate, endDate).pipe(
            catchError(err => { 
              this.toastService.error('Talepler yüklenirken hata oluştu.'); 
              console.error(err); 
              return of([] as TalepOzet[]); 
            })
          );
        }

        return this.talepService.getAllOzet().pipe(
          catchError(err => { 
            this.toastService.error('Talepler yüklenirken hata oluştu.'); 
            console.error(err); 
            return of([] as TalepOzet[]); 
          })
        );
      }),
      map(res => { 
        this.isLoading.set(false); 
        return res; 
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

  create(): void {
    this.router.navigate(['/talep/new']);
  }
}

