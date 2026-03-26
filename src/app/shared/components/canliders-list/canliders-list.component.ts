import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-canliders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canliders-list.component.html',
  styleUrls: ['./canliders-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanlidersListComponent {
  @Input() canlidersler: DersOzet[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() useStyledVersion = false;
  @Input() emptyMessage = 'Bu derse ait canlı ders bulunamadı.';

  @Output() canlidersSelected = new EventEmitter<number>();

  onRowClick(id?: number): void {
    if (id) {
      this.canlidersSelected.emit(id);
    }
  }

  trackById(index: number, item: DersOzet): number | undefined {
    return item?.id;
  }
}
