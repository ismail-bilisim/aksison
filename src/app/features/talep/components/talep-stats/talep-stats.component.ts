import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TalepStatistics } from 'src/app/core/models/talep-statistics';

@Component({
  selector: 'app-talep-stats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './talep-stats.component.html',
  styleUrl: './talep-stats.component.css'
})
export class TalepStatsComponent {
  @Input() talepStats: TalepStatistics | null = null;
  @Input() loading = false;
}
