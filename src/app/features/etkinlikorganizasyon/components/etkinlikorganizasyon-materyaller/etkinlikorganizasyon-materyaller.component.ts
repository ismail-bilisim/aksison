import { Component, Input, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EtkinlikOrganizasyonMateryalResponse } from '../../../../core/models/etkinlik-organizasyon-materyal-response';
import { EtkinlikMateryalTuruOzet } from '../../../../core/models/etkinlik-materyal-turu-ozet';
import { EtkinlikOrganizasyonMateryalService } from '../../../../core/services/api/etkinlik-organizasyon-materyal.service';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-etkinlikorganizasyon-materyaller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etkinlikorganizasyon-materyaller.component.html'
})
export class EtkinlikOrganizasyonMateryallerComponent implements OnInit {
  @Input({ required: true }) etkinlikId!: number;

  materyaller = signal<EtkinlikOrganizasyonMateryalResponse[]>([]);
  materyalTurleri = signal<EtkinlikMateryalTuruOzet[]>([]);

  selectedFile?: File;
  selectedMateryalTuruId?: number;

  private readonly destroyRef = inject(DestroyRef);
  private readonly materyalService = inject(EtkinlikOrganizasyonMateryalService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadMateryaller();
    this.loadMateryalTurleri();
  }

  loadMateryaller(): void {
    this.materyalService.getByEtkinlikOrganizasyonId(this.etkinlikId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.materyaller.set(data),
        error: (error) => {
          console.error('Materyaller yüklenemedi:', error);
          this.toastService.error('Materyaller yüklenirken hata oluştu.');
        }
      });
  }

  private loadMateryalTurleri(): void {
    this.materyalService.getMateryalTurleri()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.materyalTurleri.set(data),
        error: (error) => console.error('Materyal türleri yüklenemedi:', error)
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onMateryalUpload(): void {
    if (!this.selectedFile || !this.selectedMateryalTuruId) return;
    this.materyalService.upload(this.etkinlikId, this.selectedMateryalTuruId, this.selectedFile)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Materyal yüklendi.');
          this.selectedFile = undefined;
          this.selectedMateryalTuruId = undefined;
          this.loadMateryaller();
        },
        error: (error) => {
          console.error('Materyal yüklenemedi:', error);
          this.toastService.error('Materyal yüklenirken hata oluştu.');
        }
      });
  }

  onMateryalSil(id: number): void {
    if (!confirm('Bu materyali silmek istediğinize emin misiniz?')) return;
    this.materyalService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Materyal silindi.');
          this.loadMateryaller();
        },
        error: (error) => {
          console.error('Materyal silinemedi:', error);
          this.toastService.error('Materyal silinirken hata oluştu.');
        }
      });
  }

  onMateryalIndir(id: number, dosyaAdi: string): void {
    this.materyalService.download(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const url = globalThis.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = dosyaAdi;
          a.click();
          globalThis.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Materyal indirilemedi:', error);
          this.toastService.error('Materyal indirilirken hata oluştu.');
        }
      });
  }

  formatTarih(tarih: string | null): string {
    if (!tarih) return '-';
    try {
      return new Date(tarih).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return tarih;
    }
  }
}
