import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videoders-paydas-list',
  imports: [],
  templateUrl: './videoders-paydas-list.component.html',
  styleUrl: './videoders-paydas-list.component.css'
})
export class VideodersPaydasListComponent {
  @Input() dersId!: number;


}
