import { Component, OnInit } from '@angular/core';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDers } from 'src/app/core/models/videoders';
import { Router,RouterLink } from '@angular/router';
import { VideodersListComponent} from 'src/app/features/videoders/components/videoders-list/videoders-list.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-videoders-list-page',
  imports: [CommonModule, VideodersListComponent, RouterLink],
  templateUrl: './videoders-list-page.component.html',
  styleUrl: './videoders-list-page.component.css'
})

export class VideodersListPageComponent implements OnInit {
  videodersler: VideoDers[] = [];

  constructor(private service: VideodersService, private router: Router) { }

  ngOnInit() {
    this.service.getAll().subscribe((res) => (this.videodersler = res));
  }

  onEdit(v: VideoDers) {
    this.router.navigate(['/videoders/edit', v.kodu]);
  }

  onDelete(kodu: number) {
    if (confirm('Bu video dersi silmek istediğinize emin misiniz?')) {
      this.service.delete(kodu).subscribe(() => this.ngOnInit());
    }
  }
}
