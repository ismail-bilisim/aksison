import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CanliDersResponse } from 'src/app/core/models/canliders-response';

@Component({
  selector: 'app-canliders-basvuru',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './canliders-basvuru.component.html',
  styleUrls: ['./canliders-basvuru.component.css']
})
export class CanlidersBasvuruComponent {
  @Input() canliders?: CanliDersResponse;

  get dersSuresiFormatli(): string {
    const dak = this.canliders?.dersSuresi;
    if (!dak || isNaN(dak) || dak < 0) return '';
    const saat = Math.floor(dak / 60);
    const dakika = dak % 60;
    return `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}`;
  }
}
