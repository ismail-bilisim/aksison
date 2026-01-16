import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjeResponse } from '../../../../core/models/proje-response';
import { OnayDurumu, OnayDurumuHelper } from '../../../../core/models/onay-durumu.enum';

@Component({
  selector: 'app-proje-temel',
  templateUrl: './proje-temel.component.html',
  styleUrls: ['./proje-temel.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProjeTemelComponent {
  @Input() proje?: ProjeResponse | null;
  
  // Yetki kontrolü için Input'lar (smart component'tan gelir)
  @Input() canEdit = false;
  @Input() canSubmitForApproval = false;
  @Input() canApprove = false;

  @Output() edit = new EventEmitter<void>();
  @Output() submitForApproval = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  // Enum ve helper template'de kullanım için
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
}
