import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoDers } from '../../../../core/models/videoders';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { VideodersTemelComponent } from '../../components/videoders-temel/videoders-temel.component';
import { VideodersSorumlularComponent } from '../../components/videoders-sorumlular/videoders-sorumlular.component';
import { VideodersUcretComponent } from '../../components/videoders-ucret/videoders-ucret.component';
import { VideodersOnkosulListComponent } from '../../components/videoders-onkosul-list/videoders-onkosul-list.component';
import { VideodersKategoriListComponent } from '../../components/videoders-kategori-list/videoders-kategori-list.component';
import { VideodersProjeListComponent } from '../../components/videoders-proje-list/videoders-proje-list.component';
import { VideodersPaydasListComponent } from '../../components/videoders-paydas-list/videoders-paydas-list.component';
import { VideodersSozlesmeListComponent } from '../../components/videoders-sozlesme-list/videoders-sozlesme-list.component';
import { VideodersIslemKayitListComponent } from '../../components/videoders-islem-kayit-list/videoders-islem-kayit-list.component';
import { VideodersOzetComponent } from '../../components/videoders-ozet/videoders-ozet.component';

@Component({
  selector: 'app-videoders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    VideodersTemelComponent,
    VideodersSorumlularComponent,
    VideodersUcretComponent,
    VideodersOzetComponent,
    VideodersOnkosulListComponent,
    VideodersKategoriListComponent,
    VideodersProjeListComponent,
    VideodersPaydasListComponent,
    VideodersSozlesmeListComponent,
    VideodersIslemKayitListComponent
  ],
  templateUrl: './videoders-detail-page.component.html',
  styleUrls: ['./videoders-detail-page.component.css']
})
export class VideodersDetailPageComponent implements OnInit {
  videoders?: VideoDers;
  loading = false;
  activeTab = 'kategoriler';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videodersService = inject(VideodersService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const kodu = this.route.snapshot.paramMap.get('kodu');
      if (kodu && !isNaN(+kodu)) {
        this.loadVideoders(+kodu);
        console.log('Loading videoders with Kodu from params:', kodu);
      } else {
        // Try to get ID from snapshot as fallback
        const snapshotKodu = this.route.snapshot.paramMap.get('kodu');
        console.log('Trying snapshot Kodu:', snapshotKodu);

        if (snapshotKodu && !isNaN(+snapshotKodu)) {
          this.loadVideoders(+snapshotKodu);
        } else {
          console.error('No valid Kodu found in route params or snapshot');
          console.log('Full route snapshot:', this.route.snapshot);
          this.loading = false;
        }
      }
    });
  }

  loadVideoders(kodu: number): void {
    console.log('Loading videoders with ID:', kodu);
    this.loading = true;
    this.videoders = undefined;

    this.videodersService.getByKodu(kodu).subscribe({
      next: (data) => {
        console.log('VideodersDetailPageComponent - Loaded videoders:', data);
        this.videoders = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading videoders:', error);
        this.loading = false;
        alert('Video ders yüklenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
      }
    });
  }

  onEdit(videoders: VideoDers): void {
    if (videoders && videoders.id) {
      this.router.navigate(['/videoders/edit', videoders.id]);
    }
  }
}
