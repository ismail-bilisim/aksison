import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Component({
  selector: 'app-ders-videoders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-videoders-list.component.html',
  styleUrl: './ders-videoders-list.component.css'
})
export class DersVideodersListComponent {
  @Input() videodersler: DersOzet[] = [];
  @Input() isLoading = false;
  @Input() errorMessage = '';

  constructor(private router: Router) {}

  onRowClick(id: number): void {
    if (id) {
      this.router.navigate(['/videoders/detail', id]);
    }
  }
}
