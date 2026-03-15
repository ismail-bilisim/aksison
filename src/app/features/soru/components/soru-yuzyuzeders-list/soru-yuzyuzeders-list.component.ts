import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SoruYuzyuzedersService } from 'src/app/core/services/api/soru-yuzyuzeders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-soru-yuzyuzeders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './soru-yuzyuzeders-list.component.html',
  styleUrl: './soru-yuzyuzeders-list.component.css'
})
export class SoruYuzyuzedersListComponent implements OnInit {
  @Input() soruId!: number;

  private readonly soruService = inject(SoruYuzyuzedersService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  yuzyuzedersList: DersOzet[] = [];
  loading = false;

  ngOnInit(): void {
    if (this.soruId) {
      this.loadAllRelatedDersler();
    }
  }

  private loadAllRelatedDersler(): void {
    this.loading = true;
    this.soruService.getAllDersOzetBysoruId(this.soruId).subscribe({
      next: (data) => {
        this.yuzyuzedersList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading yuzyuzeders relations:', error);
        this.toastService.error('İlişkili dersler yüklenirken hata oluştu');
        this.loading = false;
      }
    });
  }

  navigateToYuzyuzeders(dersId?: number): void {
    if (dersId) {
      this.router.navigate(['/yuzyuzeders/detail', dersId]);
    }
  }
}
