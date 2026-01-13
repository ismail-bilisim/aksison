import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EgitmenListComponent } from '../../../egitmen/components/egitmen-list/egitmen-list.component';
import { EgitmenOzet } from '../../../../core/models/egitmen-ozet';
import { VideodersEgitmenService } from '../../../../core/services/api/videoders-egitmen.service';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-videoders-egitmen-list',
  standalone: true,
  imports: [CommonModule, EgitmenListComponent],
  template: `
    <div>
      @if (isLoading) {
        <div class="text-center p-3">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      } @else if (egitmenler.length === 0) {
        <div class="alert alert-info">
          Bu video ders için eğitmen kaydı bulunmamaktadır.
        </div>
      } @else {
        <app-egitmen-list 
          [egitmenler]="egitmenler"
          [isLoading]="isLoading">
        </app-egitmen-list>
      }
    </div>
  `
})
export class VideodersEgitmenListComponent {
  @Input({ required: true }) dersId!: number;

  egitmenler: EgitmenOzet[] = [];
  isLoading = false;
  private hasLoaded = false;

  private readonly videodersEgitmenService = inject(VideodersEgitmenService);
  private readonly toastService = inject(ToastService);

  loadEgitmenler(): void {
    if (this.hasLoaded) {
      return;
    }

    this.isLoading = true;
    this.videodersEgitmenService.getByDersId(this.dersId).subscribe({
      next: (data) => {
        this.egitmenler = data;
        this.isLoading = false;
        this.hasLoaded = true;
      },
      error: (error) => {
        console.error('Eğitmenler yüklenirken hata oluştu:', error);
        this.toastService.error('Eğitmenler yüklenirken hata oluştu');
        this.isLoading = false;
      }
    });
  }
}
