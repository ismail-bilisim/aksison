import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalepEkDosyaResponse } from '../../../../core/models/talep-ek-dosya';
import { TalepEkDosyaService } from '../../../../core/services/api/talep-ek-dosya.service';
import { take } from 'rxjs/operators';
import { ToastService } from 'src/app/core/services/api/toast.service';

@Component({
  selector: 'app-talep-ek-dosya-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './talep-ek-dosya-list.component.html',
  styleUrl: './talep-ek-dosya-list.component.css'
})
export class TalepEkDosyaListComponent implements OnInit, OnChanges {
  @Input() talepId!: number;
  ekDosyalar: TalepEkDosyaResponse[] = [];

  constructor(
    private talepEkDosyaService: TalepEkDosyaService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    if (this.talepId) {
      this.loadEkDosyalar(this.talepId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['talepId'] && changes['talepId'].currentValue !== changes['talepId'].previousValue && this.talepId) {
      this.loadEkDosyalar(this.talepId);
    }
  }

  loadEkDosyalar(talepId: number): void {
    this.talepEkDosyaService.getFilesByTalepId(talepId).pipe(take(1)).subscribe({
      next: (files) => {
        this.ekDosyalar = files;
      },
      error: (err) => {
        this.toastService.error('Ek dosyalar yüklenirken hata oluştu.');
        console.error(err);
      }
    });
  }

  downloadFile(id: number, fileName: string): void {
    this.talepEkDosyaService.downloadFile(id).pipe(take(1)).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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
