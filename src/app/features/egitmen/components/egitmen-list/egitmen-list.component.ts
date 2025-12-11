import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';

@Component({
  selector: 'app-egitmen-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './egitmen-list.component.html',
  styleUrl: './egitmen-list.component.css'
})
export class EgitmenListComponent {
  @Input() egitmenler: EgitmenOzet[] = [];
  @Input() loading = false;
}
