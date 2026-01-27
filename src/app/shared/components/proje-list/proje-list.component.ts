import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjeOzet } from 'src/app/core/models/proje-ozet';

@Component({
  selector: 'app-proje-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './proje-list.component.html',
  styleUrls: ['./proje-list.component.css']
})
export class ProjeListComponent {
  @Input() items: ProjeOzet[] = [];
  @Input() loading = false;
  @Input() deleting = false;
  @Input() modalLoading = false;
  @Input() adding = false;
  @Input() availableProjeler: ProjeOzet[] = [];

  @Output() addRequested = new EventEmitter<void>();
  @Output() addConfirmed = new EventEmitter<number[]>();
  @Output() delete = new EventEmitter<ProjeOzet>();
  @Output() projeSelected = new EventEmitter<number>();

  @ViewChild('projeModal') projeModalTemplate!: TemplateRef<any>;

  selectedProjeler: number[] = [];

  constructor(private readonly modalService: NgbModal) {}

  requestAdd(): void {
    this.selectedProjeler = [];
    this.addRequested.emit();
  }

  openModal(): void {
    if (this.projeModalTemplate) {
      this.modalService.open(this.projeModalTemplate, { size: 'lg' });
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  toggleProjeSelection(projeId: number): void {
    const index = this.selectedProjeler.indexOf(projeId);
    if (index > -1) {
      this.selectedProjeler.splice(index, 1);
    } else {
      this.selectedProjeler.push(projeId);
    }
  }

  isProjeSelected(projeId: number): boolean {
    return this.selectedProjeler.includes(projeId);
  }

  confirmAdd(): void {
    if (this.selectedProjeler.length === 0) {
      return;
    }
    this.addConfirmed.emit([...this.selectedProjeler]);
  }

  onSelect(proje: ProjeOzet): void {
    if (proje.id) {
      this.projeSelected.emit(proje.id);
    }
  }
}
