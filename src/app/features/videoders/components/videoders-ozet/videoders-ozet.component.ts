import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoDers } from '../../../../core/models/videoders';

@Component({
  selector: 'app-videoders-ozet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-ozet.component.html',
  styleUrls: ['./videoders-ozet.component.css']
})
export class VideodersOzetComponent {
  @Input() videoders?: VideoDers;
}
