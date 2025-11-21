import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoDers } from '../../../../core/models/videoders';

@Component({
  selector: 'app-videoders-sorumlular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-sorumlular.component.html',
  styleUrls: ['./videoders-sorumlular.component.css']
})
export class VideodersSorumlularComponent {
  @Input() videoders?: VideoDers;
}
