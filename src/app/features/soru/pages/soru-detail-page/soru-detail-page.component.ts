import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SoruService } from 'src/app/core/services/api/soru.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { SoruResponse } from 'src/app/core/models/soru-response';
import { SoruTemelComponent } from '../../components/soru-temel/soru-temel.component';
import { SoruVideodersListComponent } from '../../components/soru-videoders-list/soru-videoders-list.component';
import { SoruKonuListComponent } from '../../components/soru-konu-list/soru-konu-list.component';

@Component({
  selector: 'app-soru-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    SoruTemelComponent,
    SoruVideodersListComponent,
    SoruKonuListComponent
  ],
  templateUrl: './soru-detail-page.component.html',
  styleUrl: './soru-detail-page.component.css'
})
export class SoruDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly soruService = inject(SoruService);
  private readonly toastService = inject(ToastService);

  soru?: SoruResponse;
  loading = false;
  activeTab = 'temel';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.loadSoru(+id);
    } else {
      this.toastService.error('Geçersiz soru ID');
      this.router.navigate(['/soru']);
    }
  }

  private loadSoru(id: number): void {
    this.loading = true;
    this.soruService.getById(id).subscribe({
      next: (data) => {
        this.soru = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadSoru');
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
        this.loading = false;
        this.router.navigate(['/soru']);
      }
    });
  }

  onEdit(): void {
    if (this.soru?.id) {
      this.router.navigate(['/soru/edit', this.soru.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/soru']);
  }
}
