import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { ErrorHandler } from 'src/app/core/utils/error-handler';

@Component({
  selector: 'app-ders-videoders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ders-videoders-list.component.html',
  styleUrl: './ders-videoders-list.component.css'
})
export class DersVideodersListComponent implements OnInit {
  @Input() dersId!: number;
  
  videodersler: DersOzet[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private videodersService: VideodersService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.dersId) {
      this.loadVideoDersler();
    }
  }

  loadVideoDersler(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.videodersService.getByDersId(this.dersId).subscribe({
      next: (data) => {
        this.videodersler = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = ErrorHandler.extractErrorMessage(error);
        this.loading = false;
        this.toastService.error(this.errorMessage);
      }
    });
  }

  onRowClick(id: number): void {
    if (id) {
      this.router.navigate(['/videoders/detail', id]);
    }
  }
}
