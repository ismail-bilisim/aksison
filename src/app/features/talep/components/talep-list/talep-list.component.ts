import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalepOzet } from 'src/app/core/models/talep-ozet';

@Component({
  selector: 'app-talep-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talep-list.component.html',
  styleUrls: ['./talep-list.component.css']
})
export class TalepListComponent {
  // Presentational inputs
  @Input() talepler: TalepOzet[] | null = [];
  @Input() isLoading = false;

  // Presentational outputs
  @Output() view = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  // Emitters called from template
  onView(id: number): void {
    this.view.emit(id);
  }

}