import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoDers } from 'src/app/core/models/videoders-detay';

@Component({
  selector: 'app-videoders-list',
  standalone: true,
  templateUrl: './videoders-list.component.html',
  styleUrl: './videoders-list.component.css'
})

export class VideodersListComponent {
  @Input() videodersler: VideoDers[] = [];
  @Output() edit = new EventEmitter<VideoDers>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewDetail = new EventEmitter<VideoDers>();

  onEdit(v: VideoDers) {
    this.edit.emit(v);
  }

  onDelete(kodu: number) {
    this.delete.emit(kodu);
  }

  onViewDetail(v: VideoDers) {
    this.viewDetail.emit(v);
  }
}
