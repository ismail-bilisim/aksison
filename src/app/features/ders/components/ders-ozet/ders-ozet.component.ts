import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ders } from 'src/app/core/models/ders';

@Component({
  selector: 'app-ders-ozet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-ozet.component.html',
  styleUrls: ['./ders-ozet.component.css']
})
export class DersOzetComponent {
  @Input() ders?: Ders;
}
