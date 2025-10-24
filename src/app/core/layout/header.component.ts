import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgbCollapse, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgbCollapse, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './header.component.html',   //harici HTML dosyası
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  isCollapsed = true;

  constructor(private auth: AuthService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); // login sayfasına yönlendir
  }
}