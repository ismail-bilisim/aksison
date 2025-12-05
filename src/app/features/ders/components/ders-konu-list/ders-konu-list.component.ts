import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ders-konu-list',
  standalone: true,
  imports: [],
  templateUrl: './ders-konu-list.component.html',
  styleUrl: './ders-konu-list.component.css'
})
export class DersKonuListComponent {
  @Input() dersId!: number;
}
