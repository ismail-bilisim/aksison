import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VideoDersResponse } from 'src/app/core/models/videoders-response';
import { OnayDurumuHelper } from 'src/app/core/models/onay-durumu.enum';

@Component({
  selector: 'app-videoders-temel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './videoders-temel.component.html',
  styleUrls: ['./videoders-temel.component.css']
})
export class VideodersTemelComponent {
  @Input() videoders?: VideoDersResponse;

  /**
   * Get OnayDurumu description for display
   */
  getOnayDurumuText(): string {
    return OnayDurumuHelper.getText(this.videoders?.onayDurumu);
  }

  /**
   * Get OnayDurumu badge CSS class
   */
  getOnayDurumuBadge(): string {
    return OnayDurumuHelper.getBadgeClass(this.videoders?.onayDurumu);
  }

  /**
   * Get OnayDurumu icon class
   */
  getOnayDurumuIcon(): string {
    return OnayDurumuHelper.getIcon(this.videoders?.onayDurumu);
  }
}
