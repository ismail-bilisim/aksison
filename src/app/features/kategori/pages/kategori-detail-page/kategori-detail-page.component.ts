import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { KategoriService } from 'src/app/core/services/api/kategori.service';
import { Kategori } from 'src/app/core/models/kategori';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { KategoriTemelComponent } from '../../components/kategori-temel/kategori-temel.component';
import { KategoriAltKategoriListComponent } from '../../components/kategori-alt-kategori-list/kategori-alt-kategori-list.component';
import { KategoriDersListComponent } from '../../components/kategori-ders-list/kategori-ders-list.component';
import { KategoriVideodersListComponent } from '../../components/kategori-videoders-list/kategori-videoders-list.component';
import { KategoriEgitmenListComponent } from '../../components/kategori-egitmen-list/kategori-egitmen-list.component';

@Component({
  selector: 'app-kategori-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    KategoriTemelComponent,
    KategoriAltKategoriListComponent,
    KategoriDersListComponent,
    KategoriVideodersListComponent,
    KategoriEgitmenListComponent
  ],
  templateUrl: './kategori-detail-page.component.html',
  styleUrls: ['./kategori-detail-page.component.css']
})
export class KategoriDetailPageComponent implements OnInit {
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private kategoriService = inject(KategoriService);

  kategori?: Kategori;
  breadcrumbs: Kategori[] = [];
  loading = false;
  activeTab = 'altKategoriler';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.loadKategori(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadKategori(id: number): void {
    this.loading = true;
    this.kategori = undefined;

    this.kategoriService.getById(id).subscribe({
      next: (data) => {
        this.kategori = data;
        this.buildBreadcrumbs(data);
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadKategori');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  buildBreadcrumbs(kategori: Kategori): void {
    this.breadcrumbs = [];
    let current: Kategori | undefined = kategori;
    
    // Build breadcrumb trail from current to root
    while (current) {
      this.breadcrumbs.unshift(current);
      current = current.ustKategori ? { ...current.ustKategori } as Kategori : undefined;
      
      // Prevent infinite loops
      if (this.breadcrumbs.length > 10) break;
    }
  }

  onBack(): void {
    this.router.navigate(['/kategori']);
  }

  navigateToKategori(kategoriId?: number): void {
    if (kategoriId) {
      this.router.navigate(['/kategori/detail', kategoriId]);
    }
  }
}
