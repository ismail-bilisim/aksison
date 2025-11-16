import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videoders-islem-kayit-list',
  imports: [],
  templateUrl: './videoders-islem-kayit-list.component.html',
  styleUrl: './videoders-islem-kayit-list.component.css'
})
export class VideodersIslemKayitListComponent {
  @Input() dersId!: number;

}
