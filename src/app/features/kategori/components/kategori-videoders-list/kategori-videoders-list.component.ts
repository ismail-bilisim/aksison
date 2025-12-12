import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-kategori-videoders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kategori-videoders-list.component.html',
  styleUrls: ['./kategori-videoders-list.component.css']
})
export class KategoriVideodersListComponent implements OnInit {
  @Input() kategoriId!: number;

  private videodersService = inject(VideodersService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  videodersler: DersOzet[] = [];
  loading = false;

  ngOnInit(): void {
    if (this.kategoriId) {
      this.loadVideodersler();
    }
  }

  loadVideodersler(): void {
    this.loading = true;
    this.videodersService.getByKategoriler([this.kategoriId]).subscribe({
      next: (data) => {
        this.videodersler = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Video dersler yüklenirken hata:', error);
        this.toastService.error('Video dersler yüklenirken bir hata oluştu.');
        this.loading = false;
      }
    });
  }

  navigateToVideoders(videodersId?: number): void {
    if (videodersId) {
      this.router.navigate(['/videoders/detail', videodersId]);
    }
  }
}
