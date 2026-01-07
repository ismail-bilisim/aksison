import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalepDurumuOzet } from '../../../../core/models/talep-durumu';
import { TalepOzetDurum } from '../../../../core/models/talep-ozet-durum';

interface KanbanColumn {
  durum: TalepDurumuOzet;
  talepler: TalepOzetDurum[];
}

@Component({
  selector: 'app-talep-kanban',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talep-kanban.component.html',
  styleUrl: './talep-kanban.component.css'
})
export class TalepKanbanComponent {
  @Input() columns: KanbanColumn[] = [];
  @Input() talepDurumlari: TalepDurumuOzet[] = [];
  
  @Output() viewDetail = new EventEmitter<number>();

  onViewDetail(talepId: number): void {
    this.viewDetail.emit(talepId);
  }
}