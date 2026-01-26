import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-yuzyuzeders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yuzyuzeders-list.component.html',
  styleUrls: ['./yuzyuzeders-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YuzyuzedersListComponent {
  @Input() yuzyuzedersler: DersOzet[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';

  @Output() select = new EventEmitter<number>();

  onRowClick(id?: number): void {
    if (id) {
      this.select.emit(id);
    }
  }
}