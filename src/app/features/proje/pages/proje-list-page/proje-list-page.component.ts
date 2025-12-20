import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjeService } from '../../../../core/services/api/proje.service';
import { ProjeOzet } from '../../../../core/models/proje-ozet';
import { ProjeListComponent } from '../../components/proje-list/proje-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-proje-list-page',
  standalone: true,
  imports: [CommonModule, ProjeListComponent],
  templateUrl: './proje-list-page.component.html',
  styleUrl: './proje-list-page.component.css'
})
export class ProjeListPageComponent implements OnInit, OnDestroy {
  private readonly projeService = inject(ProjeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  projeler: ProjeOzet[] = [];
  pageTitle = 'Projeler';
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
        this.pageTitle = 'Projeler';
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
        this.pageTitle = 'Taslak Projeler';
        break;
      case 'ons':
        this.pageTitle = 'Onay Bekleyen Projeler';
        break;
      case 'red':
        this.pageTitle = 'Reddedilen Projeler';
        break;
      case 'ony':
        this.pageTitle = 'Onaylanan Projeler';
        break;
      default:
        this.pageTitle = 'Projeler';
    }
  }

  private loadAll(): void {
    this.projeService.getAllOzet().subscribe({
      next: (data) => {
        this.projeler = data;
      },
      error: (error) => {
        console.error('Error loading projeler:', error);
      }
    });
  }

  private loadByOnayDurumu(onayDurumu: string): void {
    this.projeService.getByOnayDurumu(onayDurumu).subscribe({
      next: (data) => {
        this.projeler = data;
      },
      error: (error) => {
        console.error('Error loading projeler by onay durumu:', error);
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

  onNewProje(): void {
    this.router.navigate(['/proje', 'new']);
  }
}
