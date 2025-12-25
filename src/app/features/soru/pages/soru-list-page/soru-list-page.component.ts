import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SoruService } from 'src/app/core/services/api/soru.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { SoruListComponent } from '../../components/soru-list/soru-list.component';
import { SoruOzet } from 'src/app/core/models/soru-ozet';

@Component({
  selector: 'app-soru-list-page',
  standalone: true,
  imports: [CommonModule, SoruListComponent],
  templateUrl: './soru-list-page.component.html',
  styleUrl: './soru-list-page.component.css'
})
export class SoruListPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly soruService = inject(SoruService);
  private readonly toastService = inject(ToastService);

  sorular: SoruOzet[] = [];
  loading = false;
  pageTitle = 'Sorular';

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    this.soruService.getAllOzet().subscribe({
      next: (data) => {
        this.sorular = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadSorular');
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
        this.loading = false;
      }
    });
  }

  onNewSoru(): void {
    this.router.navigate(['/soru/new']);
  }

  onEdit(soruId: number): void {
    this.router.navigate(['/soru/edit', soruId]);
  }

  onDelete(soruId: number): void {
    if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      this.soruService.delete(soruId).subscribe({
        next: () => {
          this.toastService.success('Soru başarıyla silindi');
          this.loadAll();
        },
        error: (error) => {
          ErrorHandler.logError(error, 'deleteSoru');
          this.toastService.error(ErrorHandler.extractErrorMessage(error));
        }
      });
    }
  }
}
