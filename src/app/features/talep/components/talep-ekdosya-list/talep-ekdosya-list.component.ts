import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalepEkdosyaResponse } from '../../../../core/models/talep-ekdosya';
import { TalepEkdosyaService } from '../../../../core/services/api/talep-ekdosya.service';
import { take } from 'rxjs/operators';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-talep-ekdosya-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talep-ekdosya-list.component.html',
  styleUrl: './talep-ekdosya-list.component.css'
})
export class TalepEkDosyaListComponent implements OnInit {
  @Input() talepId!: number;
  ekDosyalar: TalepEkdosyaResponse[] = [];
  isLoading = false;
  private hasLoaded = false; // Track if data has been loaded

  constructor(
    private readonly talepEkDosyaService: TalepEkdosyaService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    // Auto-load on first initialization
    if (this.talepId && !this.hasLoaded) {
      this.loadEkDosyalar();
    }
  }

  loadEkDosyalar(): void {
    if (!this.talepId || this.hasLoaded) return;

    this.hasLoaded = true;
    this.isLoading = true;
    this.talepEkDosyaService.getFilesByTalepId(this.talepId).pipe(take(1)).subscribe({
      next: (files) => {
        this.ekDosyalar = files;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Ek dosyalar yüklenirken hata oluştu.');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  downloadFile(id: number, fileName: string): void {
    this.talepEkDosyaService.downloadFile(id).pipe(take(1)).subscribe({
      next: (blob) => {
        const url = globalThis.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        globalThis.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastService.error('Dosya indirilirken hata oluştu.');
        console.error(err);
      }
    });
  }

  deleteFile(id: number): void {
    if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      this.talepEkDosyaService.deleteFile(id).pipe(take(1)).subscribe({
        next: () => {
          this.ekDosyalar = this.ekDosyalar.filter(f => f.id !== id);
          this.toastService.success('Dosya başarıyla silindi.');
        },
        error: (err) => {
          this.toastService.error('Dosya silinirken hata oluştu.');
          console.error(err);
        }
      });
    }
  }
}
