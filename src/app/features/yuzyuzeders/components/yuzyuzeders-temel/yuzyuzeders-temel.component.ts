import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';
import { OnayDurumuHelper } from 'src/app/core/models/onay-durumu.enum';

@Component({
  selector: 'app-yuzyuzeders-temel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './yuzyuzeders-temel.component.html',
  styleUrls: ['./yuzyuzeders-temel.component.css']
})
export class YuzyuzedersTemelComponent {
  @Input() yuzyuzeders?: YuzyuzeDersResponse;

  /**
   * Get OnayDurumu description for display
   */
  getOnayDurumuText(): string {
    return OnayDurumuHelper.getText(this.yuzyuzeders?.onayDurumu);
  }

  /**
   * Get OnayDurumu badge CSS class
   */
  getOnayDurumuBadge(): string {
    return OnayDurumuHelper.getBadgeClass(this.yuzyuzeders?.onayDurumu);
  }

  /**
   * Get OnayDurumu icon class
   */
  getOnayDurumuIcon(): string {
    return OnayDurumuHelper.getIcon(this.yuzyuzeders?.onayDurumu);
  }
}
