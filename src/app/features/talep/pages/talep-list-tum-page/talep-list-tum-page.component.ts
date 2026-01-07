import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalepListComponent } from '../../components/talep-list/talep-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, catchError, Observable } from 'rxjs';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepOzet } from 'src/app/core/models/talep-ozet';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-talep-list-page',
  templateUrl: './talep-list-tum-page.component.html',
  styleUrls: ['./talep-list-tum-page.component.css'],
  standalone: true,
  imports: [CommonModule, TalepListComponent, ReactiveFormsModule, FormsModule, RouterModule]
})
export class TalepListTumPageComponent implements OnInit {
  // Dependency Injection via inject()
  private talepService = inject(TalepService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // State management
  talepler: TalepOzet[] = [];
  isLoading = signal(false);

  // Date range properties
  startDate: string;
  endDate: string;

  constructor() {
    // Initialize with default date range (last year to today)
    const today = new Date();
    this.endDate = this.formatDate(today);
    
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    this.startDate = this.formatDate(lastYear);
  }

  ngOnInit(): void {
    this.loadTalepler();
  }

  loadTalepler(): void {
    this.isLoading.set(true);
    this.talepService.getAllOzet(this.startDate, this.endDate).subscribe({
      next: (talepler) => {
        this.talepler = talepler;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error('Tüm talepler yüklenirken hata oluştu.');
        console.error(err);
        this.talepler = [];
        this.isLoading.set(false);
      }
    });
  }

  onDateRangeChange(): void {
    this.loadTalepler();
  }

  // Handlers for presentational component outputs
  viewDetail(id: number): void {
    this.router.navigate(['/talep/detail', id]);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

