import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-videoders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-list.component.html',
  styleUrl: './videoders-list.component.css'
})
export class VideodersListComponent {

  @Input() videodersler: DersOzet[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewDetail = new EventEmitter<number>();


  onEdit(id: number) {
    this.edit.emit(id);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onViewDetail(id: number) {
    this.viewDetail.emit(id);
  }

}
