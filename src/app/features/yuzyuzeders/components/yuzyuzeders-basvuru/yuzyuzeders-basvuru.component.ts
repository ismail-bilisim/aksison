import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';

@Component({
  selector: 'app-yuzyuzeders-basvuru',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './yuzyuzeders-basvuru.component.html',
  styleUrls: ['./yuzyuzeders-basvuru.component.css']
})
export class YuzyuzedersBasvuruComponent {
  @Input() yuzyuzeders?: YuzyuzeDersResponse;

  get dersSuresiFormatli(): string {
    const dak = this.yuzyuzeders?.dersSuresi;
    if (!dak || isNaN(dak) || dak < 0) return '';
    const saat = Math.floor(dak / 60);
    const dakika = dak % 60;
    return `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}`;
  }
}
