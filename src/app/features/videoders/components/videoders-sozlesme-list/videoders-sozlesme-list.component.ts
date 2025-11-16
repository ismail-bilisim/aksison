import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videoders-sozlesme-list',
  imports: [],
  templateUrl: './videoders-sozlesme-list.component.html',
  styleUrl: './videoders-sozlesme-list.component.css'
})
export class VideodersSozlesmeListComponent {
  @Input() dersId!: number;

}
