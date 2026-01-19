import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export type ApprovalDialogMode = 'approve' | 'reject';

export interface ApprovalDialogData {
  title: string;
  message: string;
  entityName?: string;
  noteLabel: string;
  placeholder?: string;
  confirmText: string;
  cancelText?: string;
  appearance: ApprovalDialogMode;
  additionalInfo?: string;
}

@Component({
  selector: 'app-approval-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule],
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovalDialogComponent {
  note = '';

  constructor(
    @Inject(DIALOG_DATA) public data: ApprovalDialogData,
    private readonly dialogRef: DialogRef<string | null>
  ) {}

  get headerClass(): string {
    return this.data.appearance === 'approve'
      ? 'bg-success text-white'
      : 'bg-danger text-white';
  }

  get iconClass(): string {
    return this.data.appearance === 'approve'
      ? 'bi bi-check-circle'
      : 'bi bi-x-circle';
  }

  confirm(): void {
    this.dialogRef.close(this.note?.trim() ?? '');
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
