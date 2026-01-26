import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-ders-yuzyuzeders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-yuzyuzeders-list.component.html',
  styleUrl: './ders-yuzyuzeders-list.component.css'
})
export class DersYuzyuzedersListComponent {
  @Input() yuzyuzedersler: DersOzet[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';

  constructor(private router: Router) {}

  onRowClick(id: number): void {
    if (id) {
      this.router.navigate(['/yuzyuzeders/detail', id]);
    }
  }
}
