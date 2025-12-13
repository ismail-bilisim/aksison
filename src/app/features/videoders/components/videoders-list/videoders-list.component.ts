import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  onEdit(id: number) {
    this.edit.emit(id);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onRowClick(id: number) {
    if (id) {
      this.router.navigate(['/videoders/detail', id]);
    }
  }

}
