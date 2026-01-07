import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TalepService } from 'src/app/core/services/api/talep.service';
import { TalepOzet } from 'src/app/core/models/talep-ozet';
import { TalepListComponent } from '../../components/talep-list/talep-list.component';

@Component({
  selector: 'app-talep-list-durum-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TalepListComponent],
  templateUrl: './talep-list-durum-page.component.html',
  styleUrl: './talep-list-durum-page.component.css'
})
export class TalepListDurumPageComponent implements OnInit, OnDestroy {
  talepler: TalepOzet[] = [];
  durumKodu?: string;
  pageTitle = 'Durumuna Göre Talepler';
  loading = false;
  error?: string;
  
  // Date range properties
  startDate: string;
  endDate: string;
  
  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: TalepService
  ) {
    // Initialize with default date range (last year to today)
    const today = new Date();
    this.endDate = this.formatDate(today);
    
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    this.startDate = this.formatDate(lastYear);
  }

  ngOnInit() {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.durumKodu = params.get('durumKodu') || undefined;
      
      if (this.durumKodu) {
        this.setPageTitle(this.durumKodu);
        this.loadByDurum(this.durumKodu);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private setPageTitle(durumKodu: string) {
    switch (durumKodu) {
      case 'YPLCK':
        this.pageTitle = 'Yapılacak Talepler';
        break;
      case 'DEVAM':
        this.pageTitle = 'Devam Eden Talepler';
        break;
      case 'TAMAM':
        this.pageTitle = 'Tamamlanan Talepler';
        break;
      case 'IPTAL':
        this.pageTitle = 'İptal Edilen Talepler';
        break;
      default:
        this.pageTitle = 'Talepler';
    }
  }

  private loadByDurum(durumKodu: string) {
    this.loading = true;
    this.error = undefined;
    this.talepler = [];

    this.service.getTaleplerByDurumu(durumKodu, this.startDate, this.endDate).subscribe({
      next: (talepler) => {
        this.talepler = talepler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Talepler yüklenemedi:', err);
        this.error = 'Talepler yüklenirken bir hata oluştu.';
        this.talepler = [];
        this.loading = false;
      }
    });
  }

  onDateRangeChange() {
    if (this.durumKodu) {
      this.loadByDurum(this.durumKodu);
    }
  }

  viewDetail(id: number) {
    this.router.navigate(['/talep/detail', id]);
  }

  onEdit(id: number) {
    this.router.navigate(['/talep/edit', id]);
  }

  onDelete(id: number) {
    if (confirm('Bu talebi silmek istediğinizden emin misiniz?')) {
      this.service.delete(id).subscribe({
        next: () => {
          if (this.durumKodu) {
            this.loadByDurum(this.durumKodu);
          }
        },
        error: (err) => {
          console.error('Talep silinemedi:', err);
          alert('Talep silinirken bir hata oluştu.');
        }
      });
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
