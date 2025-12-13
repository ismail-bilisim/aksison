import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DersService } from 'src/app/core/services/api/ders.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { DersListComponent } from '../../components/ders-list/ders-list.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ders-list-page',
  standalone: true,
  imports: [CommonModule, DersListComponent],
  templateUrl: './ders-list-page.component.html',
  styleUrl: './ders-list-page.component.css'
})
export class DersListPageComponent implements OnInit, OnDestroy {
  dersler: DersOzet[] = [];
  onayDurumu?: string;
  pageTitle = 'Dersler';
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DersService
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.onayDurumu = params.get('onayDurumu') || undefined;
      
      if (this.onayDurumu) {
        this.setPageTitle(this.onayDurumu);
        this.loadByOnayDurumu(this.onayDurumu);
      } else {
        this.pageTitle = 'Dersler';
        this.loadAll();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private setPageTitle(onayDurumu: string) {
    switch (onayDurumu) {
      case 'ons':
        this.pageTitle = 'Onaya Sunulan Yeni Dersler';
        break;
      case 'red':
        this.pageTitle = 'Red Edilen Dersler';
        break;
      case 'ony':
        this.pageTitle = 'Onaylanan Dersler';
        break;
      case 'tas':
        this.pageTitle = 'Taslak Dersler';
        break;
      default:
        this.pageTitle = 'Dersler';
    }
  }

  private loadAll() {
    this.service.getAll().subscribe(dersler => {
      this.dersler = dersler;
    });
  }

  private loadByOnayDurumu(onayDurumu: string) {
    this.service.getByOnayDurumu(onayDurumu).subscribe(dersler => {
      this.dersler = dersler;
    });
  }

  onEdit(dersId: number) {
    if (dersId) {
      this.router.navigate(['/ders/edit', dersId]);
    }
  }

  onDelete(id: number) {
    if (confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      this.service.delete(id).subscribe(() => {
        if (this.onayDurumu) {
          this.loadByOnayDurumu(this.onayDurumu);
        } else {
          this.loadAll();
        }
      });
    }
  }

  onNewDers() {
    this.router.navigate(['/ders/new']);
  }
}
