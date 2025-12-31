import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalepOzet } from 'src/app/core/models/talep-ozet';
import { TalepDurumuOzet } from 'src/app/core/models/talep-durumu';

@Component({
  selector: 'app-talep-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talep-list.component.html',
  styleUrls: ['./talep-list.component.css']
})
export class TalepListComponent {
  // Presentational inputs
  @Input() items: TalepOzet[] | null = [];
  @Input() talepDurumlari: TalepDurumuOzet[] = [];
  @Input() isLoading = false;

  // Presentational outputs
  @Output() view = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  // Emitters called from template
  onView(id: number) {
    this.view.emit(id);
  }

  onEdit(id: number) {
    this.edit.emit(id);
  }

}