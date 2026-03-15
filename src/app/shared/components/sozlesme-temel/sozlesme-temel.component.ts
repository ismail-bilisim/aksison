import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SozlesmeVideoDersService } from 'src/app/core/services/api/sozlesme-videoders.service';
import { SozlesmeYuzyuzeDersService } from 'src/app/core/services/api/sozlesme-yuzyuzeders.service';
import { SozlesmeDersResponse as SozlesmeDersResponse } from 'src/app/core/models/sozlesme-ders-response';

@Component({
  selector: 'app-sozlesme-temel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sozlesme-temel.component.html',
  styleUrls: ['./sozlesme-temel.component.css']
})
export class SozlesmeTemelComponent {
  sozlesme!: SozlesmeDersResponse;
  dersType: 'videoders' | 'yuzyuzeders' = 'videoders';
  signing = false;
  downloading = false;

  readonly activeModal = inject(NgbActiveModal);
  private readonly sozlesmeVideoDersService = inject(SozlesmeVideoDersService);
  private readonly sozlesmeYuzyuzeDersService = inject(SozlesmeYuzyuzeDersService);

  private get sozlesmeService() {
    return this.dersType === 'yuzyuzeders' ? this.sozlesmeYuzyuzeDersService : this.sozlesmeVideoDersService;
  }

  imzala(): void {
    if (!this.sozlesme?.id || this.signing) return;
    this.signing = true;
    this.sozlesmeService.imzala(this.sozlesme.id).subscribe({
      next: (result) => {
        this.sozlesme = result;
        this.signing = false;
        this.activeModal.close('imzalandi');
      },
      error: () => {
        this.signing = false;
      }
    });
  }

  downloadPdf(): void {
    if (!this.sozlesme?.id || this.downloading) return;
    this.downloading = true;
    this.sozlesmeService.downloadPdf(this.sozlesme.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.sozlesme.dosyaAdi || 'sozlesme.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloading = false;
      },
      error: () => {
        this.downloading = false;
      }
    });
  }
}
