import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DersIslemKayit } from 'src/app/core/models/ders-islem-kayit';
import { DersIslemKayitService } from 'src/app/core/services/api/ders-islem-kayit.service';

@Component({
  selector: 'app-ders-islem-kayit-list',
  imports: [CommonModule],
  templateUrl: './ders-islem-kayit-list.component.html',
  styleUrl: './ders-islem-kayit-list.component.css'
})
export class DersIslemKayitListComponent implements OnInit {
  @Input() dersId!: number;
  items: DersIslemKayit[] = [];
  loading = false;

  private dersIslemKayitService = inject(DersIslemKayitService);

  ngOnInit(): void {
    if (this.dersId) {
      this.loadIslemKayitlar();
    }
  }

  loadIslemKayitlar(): void {
    this.loading = true;
    this.dersIslemKayitService.getByDersId(this.dersId).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ders islem kayitlar:', error);
        this.loading = false;
      }
    });
  }
}
