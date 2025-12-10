import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DersResponse } from 'src/app/core/models/ders-response';

@Component({
  selector: 'app-ders-temel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-temel.component.html',
  styleUrls: ['./ders-temel.component.css']
})
export class DersTemelComponent {
  @Input() ders?: DersResponse;
}
