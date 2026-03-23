import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';
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
  videodersler: DersOzet[] = [];
  durum?: string;
  pageTitle = 'Video Dersler';
  loading = false;
  error?: string;
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
        this.pageTitle = 'Tüm Video Dersler';
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
    this.pageTitle = titleMap[durum] || 'Video Dersler';
  }

  private loadAll() {
    this.loading = true;
    this.error = undefined;
    this.videodersler = [];

    this.service.getAllOzet().subscribe({
      next: (videodersler) => {
        this.videodersler = videodersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Video dersler yüklenemedi:', err);
        this.error = 'Video dersler yüklenirken bir hata oluştu.';
        this.videodersler = [];
        this.loading = false;
      }
    });
  }

  private loadByDurum(durum: string) {
    this.loading = true;
    this.error = undefined;
    this.videodersler = [];

    this.service.getByDurum(durum).subscribe({
      next: (videodersler) => {
        this.videodersler = videodersler;
        this.loading = false;
      },
      error: (err) => {
        console.error('Video dersler yüklenemedi:', err);
        this.error = 'Video dersler yüklenirken bir hata oluştu.';
        this.videodersler = [];
        this.loading = false;
      }
    });
  }

  viewDetail(id: number) {
      this.router.navigate(['/videoders/detail', id]);
  }

  onNewVideoders() {
    this.router.navigate(['/videoders/new']);
  }
}