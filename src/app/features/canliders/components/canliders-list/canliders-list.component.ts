import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanliDersResponse } from 'src/app/core/models/canliders-response';

@Component({
  selector: 'app-canliders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canliders-list.component.html',
  styleUrl: './canliders-list.component.css'
})
export class CanlidersListComponent {
  @Input() canlidersler: CanliDersResponse[] = [];
  @Output() viewDetail = new EventEmitter<number>();

  onViewDetail(id: number): void {
    this.viewDetail.emit(id);
  }
}
