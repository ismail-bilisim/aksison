import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaydasService } from '../../../../core/services/api/paydas.service';
import { PaydasResponse } from '../../../../core/models/paydas-response';
import { ErrorHandler } from '../../../../core/utils/error-handler';
import { ToastService } from '../../../../core/services/api/toast.service';

@Component({
  selector: 'app-paydas-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paydas-detail-page.component.html',
  styleUrls: ['./paydas-detail-page.component.css']
})
export class PaydasDetailPageComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paydasService = inject(PaydasService);

  paydas?: PaydasResponse;
  loading = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !Number.isNaN(+id)) {
        this.loadPaydas(+id);
      } else {
        this.loading = false;
      }
    });
  }

  loadPaydas(id: number): void {
    this.loading = true;
    this.paydas = undefined;

    this.paydasService.getById(id).subscribe({
      next: (data) => {
        this.paydas = data;
        this.loading = false;
      },
      error: (error) => {
        ErrorHandler.logError(error, 'loadPaydas');
        this.loading = false;
        this.toastService.error(ErrorHandler.extractErrorMessage(error));
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onEdit(): void {
    if (this.paydas?.id) {
      this.router.navigate(['/paydas', 'edit', this.paydas.id]);
    }
  }
}
