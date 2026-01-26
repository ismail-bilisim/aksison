import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SoruService } from 'src/app/core/services/api/soru-videoders.service';
import { SoruVideoDersKonuResponse } from 'src/app/core/models/soru-ders-konu';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { SoruModalComponent } from 'src/app/shared/components/soru-modal/soru-modal.component';

@Component({
  selector: 'app-soru-list',
  standalone: true,
  imports: [CommonModule, SoruModalComponent],
  templateUrl: './soru-list.component.html',
  styleUrl: './soru-list.component.css'
})
export class SoruListComponent implements OnInit {
  @Input() dersId!: number;

  @ViewChild(SoruModalComponent) soruModal!: SoruModalComponent;

  private readonly soruService = inject(SoruService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  sorular: SoruVideoDersKonuResponse[] = [];

  ngOnInit(): void {
    this.loadSorular();
  }

  private loadSorular(): void {
    this.soruService.getAllByDersId(this.dersId).subscribe({
      next: (data) => {
        console.log('Sorular yüklendi:', data);
        this.sorular = data;
      },
      error: (error) => {
        console.error('Error loading sorular:', error);
        this.toastService.error('Sorular yüklenirken hata oluştu');
      }
    });
  }

  openSoruModal(): void {
    this.soruModal.open(null); // Konu secilmeden ders bazında soru ekleme.
  }

  onSoruSaved(): void {
    this.loadSorular();
  }

  deleteDersSoru(dersSoru: SoruVideoDersKonuResponse): void {
    const soruMetniKisa = dersSoru.soru.soruMetni.length > 50 
      ? dersSoru.soru.soruMetni.substring(0, 50) + '...' 
      : dersSoru.soru.soruMetni;
      
    if (confirm(`"${soruMetniKisa}" sorusunu dersten silmek istediğinize emin misiniz?`)) {
      this.soruService.deleteDersSoru(dersSoru.id).subscribe({
        next: () => {
          this.toastService.success('Soru bu dersten başarıyla silindi');
          this.loadSorular();
        },
        error: (error) => {
          console.error('Error deleting soru:', error);
          this.toastService.error('Soru silinirken hata oluştu');
        }
      });
    }
  }
  getSoruTipiLabel(soruTipi: any): string {
    if (typeof soruTipi === 'string') {
      return soruTipi;
    }
    // Enum nesnesinden kod çekmek için
    return soruTipi?.kod || soruTipi || '-';
  }

  navigateToSoruDetail(soruId: number): void {
    if (soruId) {
      this.router.navigate(['/soru/detail', soruId]);
    }
  }

  navigateToSoruEdit(soruId: number): void {
    if (soruId) {
      this.router.navigate(['/soru/edit', soruId]);
    }
  }

} 
