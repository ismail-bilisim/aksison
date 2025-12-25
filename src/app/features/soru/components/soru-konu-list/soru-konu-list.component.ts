import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoruService } from 'src/app/core/services/api/soru-videoders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KonuOzet } from 'src/app/core/models/konu-ozet';

@Component({
  selector: 'app-soru-konu-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './soru-konu-list.component.html',
  styleUrl: './soru-konu-list.component.css'
})
export class SoruKonuListComponent implements OnInit {
  @Input() soruId!: number;

  private readonly soruService = inject(SoruService);
  private readonly toastService = inject(ToastService);

  konuList: KonuOzet[] = [];
  loading = false;

  ngOnInit(): void {
    if (this.soruId) {
      this.loadAllRelatedKonuOzet();
    }
  }

  private loadAllRelatedKonuOzet(): void {
    this.loading = true;
    this.soruService.getAllKonuOzetBySoruId (this.soruId).subscribe({
      next: (data) => {
        this.konuList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading konu relations:', error);
        this.toastService.error('İlişkili konular yüklenirken hata oluştu');
        this.loading = false;
      }
    });
  }
}
