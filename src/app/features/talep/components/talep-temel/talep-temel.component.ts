import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalepResponse } from '../../../../core/models/talep-response';
import { TalepEkDosyaListComponent } from '../talep-ek-dosya-list/talep-ek-dosya-list.component';

@Component({
  selector: 'app-talep-temel',
  templateUrl: './talep-temel.component.html',
  styleUrls: ['./talep-temel.component.css'],
  standalone: true,
  imports: [CommonModule, TalepEkDosyaListComponent],
})
export class TalepTemelComponent {
  @Input() talep?: TalepResponse | null;
  @Input() talepSahibiAdSoyad?: string;
  @Input() atananKisiAdSoyad?: string;
  
  // Yetki kontrolü için Input'lar (smart component'tan gelir)
  @Input() canEdit = true;
  @Input() canApprove = false;
  @Input() canDelete = false;

  @Output() edit = new EventEmitter<void>();
  @Output() submitForApproval = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  onEdit() { this.edit.emit(); }
  onSubmitForApproval() { this.submitForApproval.emit(); }
  onApprove() { this.approve.emit(); }
  onReject() { this.reject.emit(); }
  
  onDelete(id: number) {
    this.delete.emit(id);
  }

}
