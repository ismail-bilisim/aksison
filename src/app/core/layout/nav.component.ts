import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @Input() isOpen = false;
  @Output() sidebarClose = new EventEmitter<void>();

  expandedMenus: { [key: string]: boolean } = {};

  toggleSubmenu(label: string) {
    this.expandedMenus[label] = !this.expandedMenus[label];
  }

  isExpanded(label: string): boolean {
    return this.expandedMenus[label] || false;
  }

  closeSidebar() {
    this.sidebarClose.emit();
  }
}