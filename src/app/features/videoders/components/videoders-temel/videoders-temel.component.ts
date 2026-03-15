import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VideoDersResponse } from 'src/app/core/models/videoders-response';

@Component({
  selector: 'app-videoders-temel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './videoders-temel.component.html',
  styleUrls: ['./videoders-temel.component.css']
})
export class VideodersTemelComponent {
  @Input() videoders?: VideoDersResponse;

  get tahminiDersSuresiFormatli(): string {
    const dak = this.videoders?.tahminiDersSuresi;
    if (!dak || isNaN(dak) || dak < 0) return '';
    const saat = Math.floor(dak / 60);
    const dakika = dak % 60;
    return `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}`;
  }
}
