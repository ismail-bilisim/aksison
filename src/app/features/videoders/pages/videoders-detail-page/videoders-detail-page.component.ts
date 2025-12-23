import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoDersResponse} from '../../../../core/models/videoders-response';
import { VideodersService } from '../../../../core/services/api/videoders.service';
import { ToastService } from '../../../../core/services/api/toast.service';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { VideodersTemelComponent } from '../../components/videoders-temel/videoders-temel.component';
import { VideodersKonuListComponent } from '../../components/videoders-konu-list/videoders-konu-list.component';
import { VideodersSorumlularComponent } from '../../components/videoders-sorumlular/videoders-sorumlular.component';
import { VideodersUcretComponent } from '../../components/videoders-ucret/videoders-ucret.component';
import { VideodersOnkosulListComponent } from '../../components/videoders-onkosul-list/videoders-onkosul-list.component';
import { VideodersKategoriListComponent } from '../../components/videoders-kategori-list/videoders-kategori-list.component';
import { VideodersProjeListComponent } from '../../components/videoders-proje-list/videoders-proje-list.component';
import { VideodersPaydasListComponent } from '../../components/videoders-paydas-list/videoders-paydas-list.component';
import { VideodersSozlesmeListComponent } from '../../components/videoders-sozlesme-list/videoders-sozlesme-list.component';
import { VideodersIslemKayitListComponent } from '../../components/videoders-islem-kayit-list/videoders-islem-kayit-list.component';
import { VideodersOzetComponent } from '../../components/videoders-ozet/videoders-ozet.component';
import { VideodersSoruListComponent } from '../../components/videoders-soru-list/videoders-soru-list.component';

@Component({
  selector: 'app-videoders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    VideodersTemelComponent,
    VideodersKonuListComponent,
    VideodersSorumlularComponent,
    VideodersUcretComponent,
    VideodersOzetComponent,
    VideodersOnkosulListComponent,
    VideodersKategoriListComponent,
    VideodersProjeListComponent,
    VideodersPaydasListComponent,
    VideodersSozlesmeListComponent,
    VideodersIslemKayitListComponent,
    VideodersSoruListComponent
],
  templateUrl: './videoders-detail-page.component.html',
  styleUrls: ['./videoders-detail-page.component.css']
})
export class VideodersDetailPageComponent implements OnInit {
  videoders?: VideoDersResponse;
  loading = false;
  activeTab = 'kategoriler';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videodersService = inject(VideodersService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.loadVideoders(+id);
        console.log('Loading videoders with Kodu from params:', id);
      } else {
        // Try to get ID from snapshot as fallback
        const snapshotId = this.route.snapshot.paramMap.get('id');
        console.log('Trying snapshot ID:', snapshotId);

        if (snapshotId && !isNaN(+snapshotId)) {
          this.loadVideoders(+snapshotId);
        } else {
          console.error('No valid ID found in route params or snapshot');
          console.log('Full route snapshot:', this.route.snapshot);
          this.loading = false;
        }
      }
    });
  }

  loadVideoders(id: number): void {
    console.log('Loading videoders with ID:', id);
    this.loading = true;
    this.videoders = undefined;

    this.videodersService.getById(id).subscribe({
      next: (data) => {
        console.log('VideodersDetailPageComponent - Loaded videoders:', data);
        this.videoders = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadVideoders');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  onEdit(videodersId: number): void {
    if (videodersId) {
      this.router.navigate(['/videoders/edit', videodersId]);
    }
  }
}
