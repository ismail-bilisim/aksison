import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-ders-list',
  standalone: true,
  templateUrl: './ders-list.component.html',
  styleUrl: './ders-list.component.css'
})
export class DersListComponent {
  @Input() dersler: DersOzet[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewDetail = new EventEmitter<number>();

  onEdit(dersId: number) {
    this.edit.emit(dersId);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onViewDetail(dersId: number) {
    this.viewDetail.emit(dersId);
  }
}
