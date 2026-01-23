import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';

@Component({
  selector: 'app-yuzyuzeders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yuzyuzeders-list.component.html',
  styleUrl: './yuzyuzeders-list.component.css'
})
export class YuzyuzedersListComponent {
  @Input() yuzyuzedersler: YuzyuzeDersResponse[] = [];
  @Output() viewDetail = new EventEmitter<number>();

  onViewDetail(id: number): void {
    this.viewDetail.emit(id);
  }
}
