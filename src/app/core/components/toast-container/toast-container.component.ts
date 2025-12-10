import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
      [header]="toast.header || ''">
      {{ toast.body }}
    </ngb-toast>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1200;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}