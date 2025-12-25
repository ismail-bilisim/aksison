import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SoruService } from 'src/app/core/services/api/soru-videoders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-soru-videoders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './soru-videoders-list.component.html',
  styleUrl: './soru-videoders-list.component.css'
})
export class SoruVideodersListComponent implements OnInit {
  @Input() soruId!: number;

  private readonly soruService = inject(SoruService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  videodersList: DersOzet[] = [];
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
        this.videodersList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading videoders relations:', error);
        this.toastService.error('İlişkili dersler yüklenirken hata oluştu');
        this.loading = false;
      }
    });
  }

  navigateToVideoDers(dersId?: number): void {
    if (dersId) {
      this.router.navigate(['/videoders/detail', dersId]);
    }
  }
}
