import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgitmenResponse } from '../../../../core/models/egitmen-response';
import { OnayDurumu, OnayDurumuHelper } from '../../../../core/models/onay-durumu.enum';

@Component({
  selector: 'app-egitmen-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './egitmen-temel.component.html',
  styleUrl: './egitmen-temel.component.css'
})
export class EgitmenTemelComponent {
  @Input() egitmen?: EgitmenResponse | null;
  @Input() canEdit = false;
  @Input() canApprove = false;
  @Input() canPassive = false;
  
  // Enum ve helper template'de kullanım için
  readonly OnayDurumu = OnayDurumu;
  readonly OnayDurumuHelper = OnayDurumuHelper;

  @Output() edit = new EventEmitter<void>();
  @Output() submitForApproval = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() pasifYap = new EventEmitter<void>();
  @Output() aktifYap = new EventEmitter<void>();

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

  onPasifYap() {
    this.pasifYap.emit();
  }

  onAktifYap() {
    this.aktifYap.emit();
  }

  getOnayDurumuBadgeClass(onayDurumu: string): string {
    return OnayDurumuHelper.getBadgeClass(onayDurumu);
  }

  getOnayDurumuText(onayDurumu: string): string {
    return OnayDurumuHelper.getText(onayDurumu);
  }
}
