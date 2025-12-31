import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ReactiveFormsModule, FormControl } from '@angular/forms'; // Import ReactiveFormsModule and FormControl
import { TalepService } from '../../core/services/api/talep.service'; // Adjust path
import { TalepStatistics } from '../../core/models/talep-statistics'; // Adjust path
import { getDateRange } from '../../core/utils/date-filter.util'; // Adjust path
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Add CommonModule and ReactiveFormsModule
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  talepStats: TalepStatistics | null = null;
  selectedDateRange = new FormControl('bu ay'); // Use FormControl
  loading = false;

  constructor(private talepService: TalepService, private router: Router) {}

  ngOnInit() {
    this.selectedDateRange.valueChanges.subscribe(() => {
      this.loadTalepStatistics();
    });
    this.loadTalepStatistics(); // Initial load
  }

  loadTalepStatistics() {
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
        this.talepStats = null; // Clear stats on error
      }
    });
  }

  navigateToNewTalep(): void {
    this.router.navigate(['/talep/new']);
  }

  navigateToKanban(): void {
    this.router.navigate(['/talep/kanban']);
  }
}