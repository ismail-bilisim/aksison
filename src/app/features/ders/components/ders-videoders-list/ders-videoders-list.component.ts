import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ders-videoders-list',
  standalone: true,
  imports: [],
  templateUrl: './ders-videoders-list.component.html',
  styleUrl: './ders-videoders-list.component.css'
})
export class DersVideodersListComponent {
  @Input() dersId!: number;
}
