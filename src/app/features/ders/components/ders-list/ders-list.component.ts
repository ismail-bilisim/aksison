import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ders } from 'src/app/core/models/ders';

@Component({
  selector: 'app-ders-list',
  standalone: true,
  templateUrl: './ders-list.component.html',
  styleUrl: './ders-list.component.css'
})
export class DersListComponent {
  @Input() dersler: Ders[] = [];
  @Output() edit = new EventEmitter<Ders>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewDetail = new EventEmitter<Ders>();

  onEdit(ders: Ders) {
    this.edit.emit(ders);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onViewDetail(ders: Ders) {
    this.viewDetail.emit(ders);
  }
}
