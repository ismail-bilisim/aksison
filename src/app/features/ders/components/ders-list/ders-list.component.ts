import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-ders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-list.component.html',
  styleUrl: './ders-list.component.css'
})
export class DersListComponent {
  @Input() dersler: DersOzet[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  constructor(private router: Router) {}

  onEdit(dersId: number) {
    this.edit.emit(dersId);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onRowClick(dersId: number) {
    if (dersId) {
      this.router.navigate(['/ders/detail', dersId]);
    }
  }
}
