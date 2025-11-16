import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videoders-proje-list',
  imports: [],
  templateUrl: './videoders-proje-list.component.html',
  styleUrl: './videoders-proje-list.component.css'
})
export class VideodersProjeListComponent {
  @Input() dersId!: number;


}
