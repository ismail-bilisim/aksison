import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SozlesmeDersResponse } from 'src/app/core/models/sozlesme-ders-response';

@Component({
  selector: 'app-sozlesme-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sozlesme-list.component.html',
  styleUrl: './sozlesme-list.component.css'
})
export class SozlesmeListComponent {
  @Input() items: SozlesmeDersResponse[] = [];
  @Input() loading = false;
  @Output() select = new EventEmitter<SozlesmeDersResponse>();

  onSelect(item: SozlesmeDersResponse): void {
    this.select.emit(item);
  }
}
