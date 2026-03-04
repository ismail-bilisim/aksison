import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { VideodersKanbanComponent } from '../../components/videoders-kanban/videoders-kanban.component';
import { VideoDersKanbanColumn, KANBAN_COLUMN_CONFIG } from '../../components/videoders-kanban/videoders-kanban.model';

@Component({
  selector: 'app-videoders-kanban-page',
  standalone: true,
  imports: [CommonModule, VideodersKanbanComponent],
  templateUrl: './videoders-kanban-page.component.html',
  styleUrl: './videoders-kanban-page.component.css'
})
export class VideodersKanbanPageComponent implements OnInit {
  private videodersService = inject(VideodersService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  columns: VideoDersKanbanColumn[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadKanbanData();
  }

  loadKanbanData(): void {
    this.isLoading = true;

    this.videodersService.getAllOzet().subscribe({
      next: (dersler) => {
        this.columns = KANBAN_COLUMN_CONFIG.map(config => ({
          ...config,
          dersler: dersler.filter(d => d.durumKodu && config.durumlar.includes(d.durumKodu))
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Kanban verileri yüklenirken hata oluştu.');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onViewDetail(dersId: number): void {
    this.router.navigate(['/videoders', 'detail', dersId]);
  }
}
