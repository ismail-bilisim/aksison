import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgitmenResponse } from '../../../../core/models/egitmen-response';

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
    switch (onayDurumu) {
      case 'tas': return 'bg-secondary';
      case 'ons': return 'bg-warning';
      case 'ony': return 'bg-success';
      case 'red': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getOnayDurumuText(onayDurumu: string): string {
    switch (onayDurumu) {
      case 'tas': return 'Taslak';
      case 'ons': return 'Onay Bekliyor';
      case 'ony': return 'Onaylandı';
      case 'red': return 'Reddedildi';
      default: return onayDurumu;
    }
  }
}
