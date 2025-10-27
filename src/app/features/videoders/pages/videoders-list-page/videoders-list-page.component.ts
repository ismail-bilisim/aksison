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
  loading = false;
  error?: string;

  constructor(private service: VideodersService, private router: Router) {
    console.log('VideodersListPageComponent - Constructor çalıştı');
  }

  ngOnInit() {
    console.log('VideodersListPageComponent - ngOnInit çalıştı');
    this.loadVideoDersler();
  }

  loadVideoDersler() {
    this.loading = true;
    this.error = undefined;
    
    this.service.getAll().subscribe({
      next: (res) => {
        this.videodersler = res;
        this.loading = false;
        console.log('Video dersler yüklendi:', res);
      },
      error: (err) => {
        console.error('Video dersler yüklenirken hata:', err);
        this.error = err?.error?.message || err?.message || 'Video dersler yüklenirken hata oluştu.';
        this.loading = false;
      }
    });
  }

  onEdit(v: VideoDers) {
    this.router.navigate(['/videoders/edit', v.kodu]);
  }

  onDelete(kodu: number) {
    if (confirm('Bu video dersi silmek istediğinize emin misiniz?')) {
      this.service.delete(kodu).subscribe({
        next: () => this.loadVideoDersler(),
        error: (err) => {
          console.error('Silme hatası:', err);
          this.error = err?.error?.message || err?.message || 'Video ders silinirken hata oluştu.';
        }
      });
    }
  }
}
