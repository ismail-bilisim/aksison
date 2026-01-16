import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaydasResponse } from '../../../../core/models/paydas-response';
import { OnayDurumu, OnayDurumuHelper } from '../../../../core/models/onay-durumu.enum';

@Component({
  selector: 'app-paydas-temel',
  templateUrl: './paydas-temel.component.html',
  styleUrls: ['./paydas-temel.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PaydasTemelComponent {
  @Input() paydas?: PaydasResponse | null;
  
  // Yetki kontrolü için Input'lar (smart component'tan gelir)
  @Input() canEdit = false;
  @Input() canSubmitForApproval = false;
  @Input() canApprove = false;

  @Output() edit = new EventEmitter<void>();
  @Output() submitForApproval = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  // Enum for template
  readonly OnayDurumu = OnayDurumu;
  readonly OnayDurumuHelper = OnayDurumuHelper;

  onEdit() {
    this.edit.emit();
  }

  onSubmitForApproval() {
    this.submitForApproval.emit();
  }

  onApprove() {
    this.approve.emit();
  }

  onReject() {
    this.reject.emit();
  }

  getOnayDurumuText() {
    return OnayDurumuHelper.getText(this.paydas?.onayDurumu);
  }
}
