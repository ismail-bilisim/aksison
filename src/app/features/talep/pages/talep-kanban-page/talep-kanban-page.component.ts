import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TalepKanbanComponent } from '../../components/talep-kanban/talep-kanban.component';
import { TalepService } from '../../../../core/services/api/talep.service';
import { TalepDurumuService } from '../../../../core/services/api/talep-durumu.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { TalepDurumuOzet } from '../../../../core/models/talep-durumu';
import { TalepOzetDurum } from '../../../../core/models/talep-ozet-durum';
import { TalepRequest } from '../../../../core/models/talep-request';
import { getDateRange } from '../../../../core/utils/date-filter.util';

interface KanbanColumn {
  durum: TalepDurumuOzet;
  talepler: TalepOzetDurum[];
}

@Component({
  selector: 'app-talep-kanban-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TalepKanbanComponent],
  templateUrl: './talep-kanban-page.component.html',
  styleUrl: './talep-kanban-page.component.css'
})
export class TalepKanbanPageComponent implements OnInit {
  private talepService = inject(TalepService);
  private talepDurumuService = inject(TalepDurumuService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  columns: KanbanColumn[] = [];
  talepDurumlari: TalepDurumuOzet[] = [];
  dateRangeFilter = new FormControl('bu ay');
  isLoading = false;

  ngOnInit(): void {
    this.loadKanbanData();
    
    this.dateRangeFilter.valueChanges.pipe(
      tap(() => this.loadKanbanData())
    ).subscribe();
  }

  loadKanbanData(): void {
    this.isLoading = true;
    const { startDate, endDate } = getDateRange(this.dateRangeFilter.value || 'bu ay');

    forkJoin([
      this.talepDurumuService.getAllOzet(),
      this.talepService.getAllOzetWithDurum()
    ]).pipe(
      tap(([durumlar, talepler]) => {
        this.talepDurumlari = durumlar.sort((a, b) => a.sira - b.sira);

        // Filter talepler by date range
        const filteredTalepler = talepler.filter(talep => {
          const talepDate = new Date(talep.talepTarihi);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return talepDate >= start && talepDate <= end;
        });

        this.columns = this.talepDurumlari.map(durum => ({
          durum: durum,
          talepler: filteredTalepler.filter(talep => talep.talepDurumu.kodu === durum.kodu)
        }));
        
        this.isLoading = false;
      }),
      switchMap(() => of(true))
    ).subscribe({
      error: (err) => {
        this.toastService.error('Kanban verileri yüklenirken hata oluştu.');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onViewDetail(talepId: number): void {
    this.router.navigate(['/talep', 'detail', talepId]);
  }
}
