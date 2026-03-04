import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoDersKanbanColumn, DURUM_LABELS } from './videoders-kanban.model';

@Component({
  selector: 'app-videoders-kanban',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-kanban.component.html',
  styleUrl: './videoders-kanban.component.css'
})
export class VideodersKanbanComponent {
  columns = input<VideoDersKanbanColumn[]>([]);
  viewDetail = output<number>();

  getDurumLabel(durumKodu: string): string {
    return DURUM_LABELS[durumKodu] || durumKodu;
  }

  onViewDetail(dersId: number): void {
    this.viewDetail.emit(dersId);
  }
}
