import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDers } from 'src/app/core/models/videoders-detay';
import { VideodersListComponent } from '../../components/videoders-list/videoders-list.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videoders-list-page',
  standalone: true,
  imports: [CommonModule, VideodersListComponent],
  templateUrl: './videoders-list-page.component.html',
  styleUrl: './videoders-list-page.component.css'
})
export class VideodersListPageComponent implements OnInit, OnDestroy {
  videodersler: VideoDers[] = [];
  durum?: string;
  pageTitle = 'Video Dersler';
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: VideodersService
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.durum = params.get('durum') || undefined;
      
      if (this.durum) {
        this.setPageTitle(this.durum);
        this.loadByDurum(this.durum);
      } else {
        this.pageTitle = 'Video Dersler';
        this.loadAll();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private setPageTitle(durum: string) {
    switch (durum) {
      case 'aktif':
        this.pageTitle = 'Aktif Video Dersler';
        break;
      case 'plann':
        this.pageTitle = 'Planlanan Video Dersler';
        break;
      case 'anlas':
        this.pageTitle = 'Anlaşılan Video Dersler';
        break;
      case 'cekim':
        this.pageTitle = 'Çekimdeki Video Dersler';
        break;
      case 'teslim':
        this.pageTitle = 'Teslim Alınan Video Dersler';
        break;
      case 'odeme':
        this.pageTitle = 'Ödeme Aşamasındaki Video Dersler';
        break;
      case 'iptal':
        this.pageTitle = 'İptal Edilen Video Dersler';
        break;
      case 'tamam':
        this.pageTitle = 'Tamamlanan Video Dersler';
        break;
      // default:
      //   this.pageTitle = 'Video Dersler';
    }
  }

  private loadAll() {
    this.service.getAll().subscribe(videodersler => {
      this.videodersler = videodersler;
    });
  }

  private loadByDurum(durum: string) {
    this.service.getByDurum(durum).subscribe(videodersler => {
      this.videodersler = videodersler;
    });
  }

  onEdit(videoders: VideoDers) {
    if (videoders.kodu) {
      this.router.navigate(['/videoders/edit', videoders.kodu]);
    }
  }

  onViewDetail(videoders: VideoDers) {
    if (videoders.kodu) {
      this.router.navigate(['/videoders/detail', videoders.kodu]);
    }
  }

  onDelete(kodu: number) {
    if (confirm('Bu video dersi silmek istediğinizden emin misiniz?')) {
      this.service.delete(kodu).subscribe(() => {
        if (this.durum) {
          this.loadByDurum(this.durum);
        } else {
          this.loadAll();
        }
      });
    }
  }

  onNewVideoders() {
    this.router.navigate(['/videoders/new']);
  }
}