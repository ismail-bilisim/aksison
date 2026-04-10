import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';
import { GlobalSearchComponent } from './global-search/global-search.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, GlobalSearchComponent],
  templateUrl: './header.component.html',   //harici HTML dosyası
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  kullaniciadSoyad = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly kullaniciService: KullaniciService
  ) { }

  ngOnInit(): void {
    const userId = this.auth.getUserId();
    if (userId) {
      this.kullaniciService.getById(+userId).subscribe({
        next: (k) => this.kullaniciadSoyad = `${k.ad} ${k.soyad}`,
      });
    }
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); // login sayfasına yönlendir
  }
}