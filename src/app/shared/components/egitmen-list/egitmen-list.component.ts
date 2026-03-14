import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';
import { SozlesmeEditComponent } from '../sozlesme-edit/sozlesme-edit.component';

@Component({
  selector: 'app-egitmen-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './egitmen-list.component.html',
  styleUrls: ['./egitmen-list.component.css']
})
export class EgitmenListComponent {
  @Input() items: EgitmenOzet[] = [];
  @Input() loading = false;
  @Input() deleting = false;
  @Input() canAssign = false;
  @Input() modalLoading = false;
  @Input() assigning = false;
  @Input() availableEgitmenler: EgitmenOzet[] = [];
  @Input() dersId?: number;

  @Output() addRequested = new EventEmitter<string>();
  @Output() addConfirmed = new EventEmitter<number[]>();
  @Output() delete = new EventEmitter<number>();
  @Output() egitmenSelected = new EventEmitter<number>();
  @Output() sozlesmeCreated = new EventEmitter<any>();

  @ViewChild('egitmenModal') egitmenModalTemplate!: TemplateRef<any>;

  selectedEgitmenIds: number[] = [];
  searchTerm = '';

  constructor(private readonly modalService: NgbModal) {}

  requestAdd(): void {
    if (!this.canAssign) return;
    this.selectedEgitmenIds = [];
    this.searchTerm = '';
    this.addRequested.emit(this.searchTerm);
  }

  openModal(): void {
    if (this.egitmenModalTemplate) {
      this.modalService.open(this.egitmenModalTemplate, { centered: true, size: 'lg' });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  toggleSelect(id: number): void {
    if (this.selectedEgitmenIds.includes(id)) {
      this.selectedEgitmenIds = this.selectedEgitmenIds.filter(x => x !== id);
    } else {
      this.selectedEgitmenIds = [...this.selectedEgitmenIds, id];
    }
  }

  confirmAdd(): void {
    if (this.selectedEgitmenIds.length === 0) return;
    this.addConfirmed.emit([...this.selectedEgitmenIds]);
  }

  onSelect(egitmen: EgitmenOzet): void {
    if (egitmen.id) {
      this.egitmenSelected.emit(egitmen.id);
    }
  }

  openSozlesmeModal(egitmen: EgitmenOzet): void {
    if (!this.dersId || !egitmen.id) return;
    const modalRef = this.modalService.open(SozlesmeEditComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.dersId = this.dersId;
    modalRef.componentInstance.egitmenId = egitmen.id;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.sozlesmeCreated.emit(result);
        }
      },
      () => {} // dismissed
    );
  }
}
