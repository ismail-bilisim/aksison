import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KategoriOzet } from 'src/app/core/models/kategori-ozet';

@Component({
  selector: 'app-kategori-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kategori-list.component.html',
  styleUrl: './kategori-list.component.css'
})
export class KategoriListComponent {
  @Input() kategoriler: KategoriOzet[] = [];
  @Output() kategoriClick = new EventEmitter<number>();

  onKategoriClick(id: number | undefined): void {
    if (id) {
      this.kategoriClick.emit(id);
    }
  }
}
