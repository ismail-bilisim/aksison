import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalepResponse } from '../../../../core/models/talep-response';
import { KullaniciOzet } from '../../../../core/models/kullanici-ozet';
import { OnayDurumu, OnayDurumuHelper } from '../../../../core/models/onay-durumu.enum';

@Component({
  selector: 'app-talep-temel',
  templateUrl: './talep-temel.component.html',
  styleUrls: ['./talep-temel.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TalepTemelComponent {
  @Input() talep?: TalepResponse | null;
  
  // Enum ve helper template'de kullanım için
  readonly OnayDurumu = OnayDurumu;
  readonly OnayDurumuHelper = OnayDurumuHelper;
  
  // Yetki kontrolü için Input'lar (smart component'tan gelir)
  @Input() canEdit = false;
  @Input() canApprove = false;
  @Input() canDelete = false;
  @Input() canCancel = false;
  @Input() canConclude = false;
  
  // Atama için Input'lar
  @Input() canAssignToSelf = false;
  @Input() canAssignToOthers = false;
  @Input() assignableUsers: KullaniciOzet[] = [];

  @Output() edit = new EventEmitter<void>();
  @Output() submitForApproval = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();
  @Output() assignToSelf = new EventEmitter<void>();
  @Output() assignToOther = new EventEmitter<void>();
  @Output() cancell = new EventEmitter<void>()
  @Output() conclude = new EventEmitter<void>()

  onEdit() {
    this.edit.emit();
  }
  onSubmitForApproval() { 
    this.submitForApproval.emit(); }
  

  onApprove() { 
    this.approve.emit(); 
  }
  
  onReject() { 
    this.reject.emit(); 
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onAssignToSelf() {
    this.assignToSelf.emit();
  }

  onAssignToOther() {
    this.assignToOther.emit();
  }

  onCancel(id: number) {
    this.cancell.emit();
  }

  onConclude(id: number) {
    this.conclude.emit();
  }

}
