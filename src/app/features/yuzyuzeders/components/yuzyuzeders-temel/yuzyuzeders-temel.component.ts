import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';

@Component({
  selector: 'app-yuzyuzeders-temel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './yuzyuzeders-temel.component.html',
  styleUrls: ['./yuzyuzeders-temel.component.css']
})
export class YuzyuzedersTemelComponent {
  @Input() yuzyuzeders?: YuzyuzeDersResponse;
}
