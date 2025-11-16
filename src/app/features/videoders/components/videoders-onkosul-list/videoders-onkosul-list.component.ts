import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videoders-onkosul-list',
  imports: [],
  templateUrl: './videoders-onkosul-list.component.html',
  styleUrl: './videoders-onkosul-list.component.css'
})
export class VideodersOnkosulListComponent {
  @Input() dersId!: number;


}
