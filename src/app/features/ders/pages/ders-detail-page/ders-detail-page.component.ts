import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Ders } from 'src/app/core/models/ders';
import { DersService } from 'src/app/core/services/api/ders.service';
import { DersTemelComponent } from '../../components/ders-temel/ders-temel.component';
import { DersOzetComponent } from '../../components/ders-ozet/ders-ozet.component';
import { DersKonuListComponent } from '../../components/ders-konu-list/ders-konu-list.component';
import { DersVideodersListComponent } from '../../components/ders-videoders-list/ders-videoders-list.component';
import { DersKategoriListComponent } from '../../components/ders-kategori-list/ders-kategori-list.component';

@Component({
  selector: 'app-ders-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    DersTemelComponent,
    DersOzetComponent,
    DersKonuListComponent,
    DersVideodersListComponent,
    DersKategoriListComponent
  ],
  templateUrl: './ders-detail-page.component.html',
  styleUrls: ['./ders-detail-page.component.css']
})
export class DersDetailPageComponent implements OnInit {
  ders?: Ders;
  loading = false;
  activeTab = 'temel';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dersService = inject(DersService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.loadDers(+id);
        console.log('Loading ders with ID from params:', id);
      } else {
        // Try to get ID from snapshot as fallback
        const snapshotId = this.route.snapshot.paramMap.get('id');
        console.log('Trying snapshot ID:', snapshotId);

        if (snapshotId && !isNaN(+snapshotId)) {
          this.loadDers(+snapshotId);
        } else {
          console.error('No valid ID found in route params or snapshot');
          console.log('Full route snapshot:', this.route.snapshot);
          this.loading = false;
        }
      }
    });
  }

  loadDers(id: number): void {
    console.log('Loading ders with ID:', id);
    this.loading = true;
    this.ders = undefined;

    this.dersService.getById(id).subscribe({
      next: (data) => {
        console.log('DersDetailPageComponent - Loaded ders:', data);
        this.ders = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ders:', error);
        this.loading = false;
        alert('Ders yüklenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
      }
    });
  }

  onEdit(ders: Ders): void {
    if (ders && ders.id) {
      this.router.navigate(['/ders/edit', ders.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/ders']);
  }
}
