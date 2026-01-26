import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-videoders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-list.component.html',
  styleUrls: ['./videoders-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideodersListComponent {
  @Input() videodersler: DersOzet[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';

  @Output() select = new EventEmitter<number>();

  onRowClick(id?: number): void {
    if (id) {
      this.select.emit(id);
    }
  }
}