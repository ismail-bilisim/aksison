import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalepIslemkayit } from 'src/app/core/models/talep-islemkayit';
import { TalepService } from 'src/app/core/services/api/talep.service';

@Component({
  selector: 'app-talep-islemkayit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talep-islemkayit-list.component.html',
  styleUrl: './talep-islemkayit-list.component.css'
})
export class TalepIslemkayitListComponent implements OnInit {
  @Input() talepId!: number;
  items: TalepIslemkayit[] = [];
  isLoading = false;
  private hasLoaded = false; // Track if data has been loaded

  private readonly talepIslemKayitService = inject(TalepService);

  ngOnInit(): void {
    // Auto-load on first initialization
    if (this.talepId && !this.hasLoaded) {
      this.loadIslemKayitlar();
    }
  }

  loadIslemKayitlar(): void {
    if (!this.talepId || this.hasLoaded) return;
    
    this.hasLoaded = true;
    this.isLoading = true;
    this.talepIslemKayitService.getByTalepId(this.talepId).subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('İşlem kayıtları yüklenirken hata oluştu:', error);
        this.isLoading = false;
      }
    });
  }
}