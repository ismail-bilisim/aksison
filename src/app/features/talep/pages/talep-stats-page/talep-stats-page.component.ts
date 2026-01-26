import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepStatistics } from 'src/app/core/models/talep-statistics';
import { getDateRange } from 'src/app/core/utils/date-filter.util';
import { TalepStatsComponent } from '../../components/talep-stats/talep-stats.component';

@Component({
  selector: 'app-talep-stats-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TalepStatsComponent],
  templateUrl: './talep-stats-page.component.html',
  styleUrl: './talep-stats-page.component.css'
})
export class TalepStatsPageComponent implements OnInit {
  private readonly talepService = inject(TalepService);
  
  talepStats: TalepStatistics | null = null;
  selectedDateRange = new FormControl('bu ay');
  loading = false;

  ngOnInit(): void {
    this.selectedDateRange.valueChanges.subscribe(() => {
      this.loadTalepStatistics();
    });
    this.loadTalepStatistics(); // Initial load
  }

  loadTalepStatistics(): void {
    this.loading = true;
    const { startDate, endDate } = getDateRange(this.selectedDateRange.value || 'bu ay');

    this.talepService.getStatistics(startDate, endDate).subscribe({
      next: (stats) => {
        this.talepStats = stats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load talep statistics:', err);
        this.loading = false;
        this.talepStats = null;
      }
    });
  }
}
