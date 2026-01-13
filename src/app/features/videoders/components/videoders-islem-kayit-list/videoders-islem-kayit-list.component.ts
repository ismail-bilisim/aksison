import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoDersIslemKayit } from 'src/app/core/models/videoders-islem-kayit';
import { VideoDersIslemKayitService } from 'src/app/core/services/api/videoders-islem-kayit.service';

@Component({
  selector: 'app-videoders-islem-kayit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-islem-kayit-list.component.html',
  styleUrl: './videoders-islem-kayit-list.component.css'
})
export class VideodersIslemKayitListComponent implements OnInit {
  @Input() dersId!: number;
  items: VideoDersIslemKayit[] = [];
  loading = false;

  private videoDersIslemKayitService = inject(VideoDersIslemKayitService);

  ngOnInit(): void {
    if (this.dersId) {
      this.loadIslemKayitlar();
    }
  }

  loadIslemKayitlar(): void {
    this.loading = true;
    this.videoDersIslemKayitService.getByDersId(this.dersId).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading video ders islem kayitlar:', error);
        this.loading = false;
      }
    });
  }
}
