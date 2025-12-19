import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaydasOzet } from '../../../../core/models/paydas-ozet';

@Component({
  selector: 'app-paydas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paydas-list.component.html',
  styleUrl: './paydas-list.component.css'
})
export class PaydasListComponent {
  @Input() paydaslar: PaydasOzet[] = [];
  
  private readonly router = inject(Router);

  onPaydasClick(id: number): void {
    this.router.navigate(['/paydas', id]);
  }
}
