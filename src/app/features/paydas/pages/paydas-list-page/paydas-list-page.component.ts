import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaydasService } from '../../../../core/services/api/paydas.service';
import { PaydasOzet } from '../../../../core/models/paydas-ozet';
import { PaydasListComponent } from '../../components/paydas-list/paydas-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paydas-list-page',
  standalone: true,
  imports: [CommonModule, PaydasListComponent],
  templateUrl: './paydas-list-page.component.html',
  styleUrl: './paydas-list-page.component.css'
})
export class PaydasListPageComponent implements OnInit, OnDestroy {
  private readonly paydasService = inject(PaydasService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  paydaslar: PaydasOzet[] = [];
  pageTitle = 'Paydaşlar';
  onayDurumu?: string;
  private routeSubscription?: Subscription;

  ngOnInit(): void {
    // Route parametresi değişikliklerini dinle
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.onayDurumu = params.get('onayDurumu') || undefined;
      
      if (this.onayDurumu) {
        this.setPageTitle(this.onayDurumu);
        this.loadByOnayDurumu(this.onayDurumu);
      } else {
        this.pageTitle = 'Paydaşlar';
        this.loadAll();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private setPageTitle(onayDurumu: string): void {
    switch (onayDurumu) {
      case 'tas':
        this.pageTitle = 'Taslak Paydaşlar';
        break;
      case 'ons':
        this.pageTitle = 'Onay Bekleyen Paydaşlar';
        break;
      case 'red':
        this.pageTitle = 'Reddedilen Paydaşlar';
        break;
      case 'ony':
        this.pageTitle = 'Onaylanan Paydaşlar';
        break;
      default:
        this.pageTitle = 'Paydaşlar';
    }
  }

  private loadAll(): void {
    this.paydasService.getAllOzet().subscribe({
      next: (data) => {
        this.paydaslar = data;
      },
      error: (error) => {
        console.error('Error loading paydaslar:', error);
      }
    });
  }

  private loadByOnayDurumu(onayDurumu: string): void {
    this.paydasService.getByOnayDurumu(onayDurumu).subscribe({
      next: (data) => {
        this.paydaslar = data;
      },
      error: (error) => {
        console.error('Error loading paydaslar by onay durumu:', error);
      }
    });
  }

  onRefresh(): void {
    if (this.onayDurumu) {
      this.loadByOnayDurumu(this.onayDurumu);
    } else {
      this.loadAll();
    }
  }

  onNewPaydas(): void {
    this.router.navigate(['/paydas', 'new']);
  }
}