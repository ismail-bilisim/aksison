import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Kullanici } from 'src/app/core/models/kullanici';

@Component({
  selector: 'app-kullanici-list',
  templateUrl: './kullanici-list.component.html',
})
export class KullaniciListComponent {
  @Input() kullanicilar: Kullanici[] = [];
  @Output() edit = new EventEmitter<Kullanici>();
  @Output() delete = new EventEmitter<number>();

  trackById(index: number, item: Kullanici): number | undefined {
    return item.id;
  }

  onEdit(kullanici: Kullanici) {
    this.edit.emit(kullanici);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
