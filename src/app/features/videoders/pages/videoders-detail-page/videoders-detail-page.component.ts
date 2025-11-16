import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { VideoDers } from 'src/app/core/models/videoders-detay';
import { VideodersDetailComponent } from '../../components/videoders-detail/videoders-detail.component';
import { VideodersKategoriListComponent } from '../../components/videoders-kategori-list/videoders-kategori-list.component';
import { VideodersKonuListComponent } from '../../components/videoders-konu-list/videoders-konu-list.component';
import { VideodersOnkosulListComponent } from '../../components/videoders-onkosul-list/videoders-onkosul-list.component';
import { VideodersPaydasListComponent } from '../../components/videoders-paydas-list/videoders-paydas-list.component';
import { VideodersProjeListComponent } from '../../components/videoders-proje-list/videoders-proje-list.component';
import { VideodersSozlesmeListComponent } from '../../components/videoders-sozlesme-list/videoders-sozlesme-list.component';
import { VideodersIslemKayitListComponent } from '../../components/videoders-islem-kayit-list/videoders-islem-kayit-list.component';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-videoders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    VideodersDetailComponent,
    VideodersKategoriListComponent,
    VideodersKonuListComponent,
    VideodersOnkosulListComponent,
    VideodersPaydasListComponent,
    VideodersProjeListComponent,
    VideodersSozlesmeListComponent,
    VideodersIslemKayitListComponent,
    NgbNavModule
  ],
  templateUrl: './videoders-detail-page.component.html',
  styleUrl: './videoders-detail-page.component.css'
})
export class VideodersDetailPageComponent implements OnInit {
  videoders?: VideoDers;
  loading = true;
  activeTab = 'kategoriler';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: VideodersService
  ) {}

  ngOnInit() {
    const kodu = this.route.snapshot.paramMap.get('kodu');
    if (kodu) {
      this.loadVideoders(+kodu);
    }
  }

  private loadVideoders(kodu: number) {
    this.loading = true;
    this.service.getByKodu(kodu).subscribe({
      next: (videoders) => {
        this.videoders = videoders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Video ders yüklenirken hata:', error);
        this.loading = false;
      }
    });
  }

  onEdit(videoders: VideoDers) {
    if (videoders.kodu) {
      this.router.navigate(['/videoders/edit', videoders.kodu]);
    }
  }


}
