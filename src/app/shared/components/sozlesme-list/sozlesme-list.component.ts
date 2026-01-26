import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sozlesme-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sozlesme-list.component.html',
  styleUrl: './sozlesme-list.component.css'
})
export class SozlesmeListComponent {
  @Input() dersId!: number;

}
