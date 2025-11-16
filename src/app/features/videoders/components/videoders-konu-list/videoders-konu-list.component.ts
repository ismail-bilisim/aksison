import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videoders-konu-list',
  imports: [],
  templateUrl: './videoders-konu-list.component.html',
  styleUrl: './videoders-konu-list.component.css'
})
export class VideodersKonuListComponent {
  @Input() dersId!: number;


}
