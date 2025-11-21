import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoDers } from '../../../../core/models/videoders';

@Component({
  selector: 'app-videoders-ucret',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule],
  templateUrl: './videoders-ucret.component.html',
  styleUrls: ['./videoders-ucret.component.css']
})
export class VideodersUcretComponent {
  @Input() videoders?: VideoDers;
}
