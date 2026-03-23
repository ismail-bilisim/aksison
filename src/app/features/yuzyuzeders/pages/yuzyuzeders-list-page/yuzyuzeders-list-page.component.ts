import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { YuzyuzedersService } from 'src/app/core/services/api/yuzyuzeders.service';
import { YuzyuzeDersResponse } from 'src/app/core/models/yuzyuzeders-response';
import { YuzyuzedersListComponent } from '../../components/yuzyuzeders-list/yuzyuzeders-list.component';

@Component({
  selector: 'app-yuzyuzeders-list-page',
  standalone: true,
  imports: [CommonModule, YuzyuzedersListComponent],
  templateUrl: './yuzyuzeders-list-page.component.html',
  styleUrl: './yuzyuzeders-list-page.component.css'
})
export class YuzyuzedersListPageComponent implements OnInit, OnDestroy {
  yuzyuzedersler: YuzyuzeDersResponse[] = [];
  durum?: string;
  pageTitle = 'Yüz Yüze Dersler';
  loading = false;
  error?: string;
  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: YuzyuzedersService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.durum = params.get('durum') || undefined;
      
      if (this.durum) {
        this.setPageTitle(this.durum);
        this.loadByDurum(this.durum);
      } else {
        this.pageTitle = 'Tüm Yüz Yüze Dersler';
        this.loadAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private setPageTitle(durum: string): void {
    const titleMap: Record<string, string> = {
      'TASLK': 'Taslak Dersler',
      'DBONS': 'Başlatma Onayına Sunulanlar',
      'DBONY': 'Başlatma Onayı Verilenler',
      'DBRED': 'Başlatma Reddedilenler',
      'ICEGN': 'İçeriği Eğitmene Gönderilenler',
      'EICOS': 'İçerik Onayına Sunulanlar',
      'ICONY': 'İçerik Onaylananlar',
      'ICRED': 'İçerik Reddedilenler',
      'EOVIS': 'Örnek Video İstenenler',
      'EOVGN': 'Örnek Video Gönderilenler',
      'OVONY': 'Örnek Video Onaylananlar',
      'OVREV': 'Örnek Video Revize İstenenler',
      'OVRED': 'Örnek Video Reddedilenler',
      'VONEG': 'Örnek Video Onayı Eğitmene Gönderilenler',
      'EIZOS': 'İzlence Onayına Sunulanlar',
      'IZONY': 'İzlence Onaylananlar',
      'IZRED': 'İzlence Reddedilenler',
      'SOZET': 'Sözleşme Talep Edilenler',
      'SOZIM': 'Sözleşme İmzalananlar',
      'SOZRD': 'Sözleşme Reddedilenler',
      'CKTML': 'Çekim Tamamlananlar',
      'COONV': 'Çekim Ön Onay Verilenler',
      'CRVIS': 'Çekim Revize İstenenler',
      'CKRED': 'Çekim Reddedilenler',
      'DEKON': 'Detaylı Kontrol Onaylananlar',
      'DEKRV': 'Detaylı Kontrol Revize İstenenler',
      'RVZTM': 'Detaylı Revize Tamamlananlar',
      'SRKNO': 'Soru Kontrol Onaylananlar',
      'SRKNR': 'Soru Kontrol Revize İstenenler',
      'SRVTM': 'Soru Revizesi Tamamlananlar',
      'VMNTM': 'Video Montajı Tamamlananlar',
      'GRFTM': 'Grafik Tamamlananlar',
      'TVDTM': 'Tanıtım Videosu Tamamlananlar',
      'AYZTM': 'Alt Yazı Tamamlananlar',
      'STBTM': 'Storyboard Tamamlananlar',
      'LMSYK': 'LMS\'e Yüklenenler',
      'YOEOS': 'Yayın Öncesi Onaya Sunulanlar',
      'YAYON': 'Yayınlama Onaylananlar',
      'YAYRD': 'Yayınlama Reddedilenler',
      'YAYIN': 'Yayına Alınanlar',
      'SMEDY': 'Sosyal Medyada Duyurulanlar',
      'IPTAL': 'İptal Edilenler',
      'YKLDR': 'Yayından Kaldırılanlar'
    };
    this.pageTitle = titleMap[durum] || 'Yüz Yüze Dersler';
  }

  private loadAll(): void {
    this.loading = true;
    this.error = undefined;
    this.yuzyuzedersler = [];

    this.service.getAllOzet().subscribe({
      next: (yuzyuzedersler) => {
        this.yuzyuzedersler = yuzyuzedersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Yüz yüze dersler yüklenemedi:', err);
        this.error = 'Yüz yüze dersler yüklenirken bir hata oluştu.';
        this.yuzyuzedersler = [];
        this.loading = false;
      }
    });
  }

  private loadByDurum(durum: string): void {
    this.loading = true;
    this.error = undefined;
    this.yuzyuzedersler = [];

    this.service.getAllByDurum(durum).subscribe({
      next: (yuzyuzedersler) => {
        this.yuzyuzedersler = yuzyuzedersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Yüz yüze dersler yüklenemedi:', err);
        this.error = 'Yüz yüze dersler yüklenirken bir hata oluştu.';
        this.yuzyuzedersler = [];
        this.loading = false;
      }
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/yuzyuzeders/detail', id]);
  }

  onNewYuzyuzeders(): void {
    this.router.navigate(['/yuzyuzeders/new']);
  }
}
