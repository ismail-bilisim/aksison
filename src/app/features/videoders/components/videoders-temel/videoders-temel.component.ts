import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoDers } from 'src/app/core/models/videoders-detay';

@Component({
  selector: 'app-videoders-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-temel.component.html',
  styleUrls: ['./videoders-temel.component.css']
})
export class VideodersTemelComponent {
  @Input() videoders?: VideoDers;
}
