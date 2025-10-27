import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Kullanici } from 'src/app/core/models/kullanici';

@Component({
  selector: 'app-kullanici-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kullanici-list.component.html',
  styleUrl: './kullanici-list.component.css'
})
export class KullaniciListComponent {
  @Input() kullanicilar: Kullanici[] = [];
  @Output() edit = new EventEmitter<Kullanici>();
  @Output() delete = new EventEmitter<number>();

  constructor(private router: Router) {}

  trackById(index: number, item: Kullanici): number | undefined {
    return item.id;
  }

  onRowClick(kullanici: Kullanici, event: Event) {
    // Prevent navigation if clicking on action buttons
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    if (kullanici.id) {
      this.router.navigate(['/kullanici', kullanici.id]);
    }
  }

  onEdit(kullanici: Kullanici, event: Event) {
    event.stopPropagation();
    this.edit.emit(kullanici);
  }

  onDelete(id: number, event: Event) {
    event.stopPropagation();
    this.delete.emit(id);
  }
}


