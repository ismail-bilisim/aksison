import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PaydasOzet } from 'src/app/core/models/paydas-ozet';

@Component({
  selector: 'app-paydas-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './paydas-list.component.html',
  styles: ['.cursor-pointer{cursor:pointer;}']
})
export class PaydasListComponent {
  @Input() items: PaydasOzet[] = [];
  @Input() loading = false;
  @Input() deleting = false;
  @Input() modalLoading = false;
  @Input() adding = false;
  @Input() availablePaydaslar: PaydasOzet[] = [];

  @Output() addRequested = new EventEmitter<void>();
  @Output() addConfirmed = new EventEmitter<number[]>();
  @Output() delete = new EventEmitter<PaydasOzet>();

  @ViewChild('paydasModal') paydasModalTemplate!: TemplateRef<any>;

  selectedPaydaslar: number[] = [];

  constructor(private readonly modalService: NgbModal) {}

  requestAdd(): void {
    this.selectedPaydaslar = [];
    this.addRequested.emit();
  }

  openModal(): void {
    if (this.paydasModalTemplate) {
      this.modalService.open(this.paydasModalTemplate, { size: 'lg' });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  togglePaydasSelection(paydasId: number): void {
    const index = this.selectedPaydaslar.indexOf(paydasId);
    if (index > -1) {
      this.selectedPaydaslar.splice(index, 1);
    } else {
      this.selectedPaydaslar.push(paydasId);
    }
  }

  isPaydasSelected(paydasId: number): boolean {
    return this.selectedPaydaslar.includes(paydasId);
  }

  confirmAdd(): void {
    if (this.selectedPaydaslar.length === 0) {
      return;
    }
    this.addConfirmed.emit([...this.selectedPaydaslar]);
  }
}
