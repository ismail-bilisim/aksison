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
  @Input() useStyledVersion = false;
  @Input() emptyMessage = 'Bu derse ait yuzyuze ders bulunamadı.';

  @Output() videoSelected = new EventEmitter<number>();

  onRowClick(id?: number): void {
    if (id) {
      this.videoSelected.emit(id);
    }
  }

  trackById(index: number, item: DersOzet): number | undefined {
    return item?.id;
  }
}