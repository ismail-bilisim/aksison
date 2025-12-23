// File: aksison/src/app/features/proje/components/proje-videoders-list/proje-videoders-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideodersService } from 'src/app/core/services/api/videoders.service';
import { ToastService } from 'src/app/core/services/api/toast.service';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { ErrorHandler } from 'src/app/core/utils/error-handler';
import { NgbModal, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proje-videoders-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule, NgbNavModule, ProjeVideodersListComponent],
  templateUrl: './proje-videoders-list.component.html',
  styleUrl: './proje-videoders-list.component.css'
})
export class ProjeVideodersListComponent implements OnInit {
  @Input() projeId!: number;
  
  videodersler: DersOzet[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private videodersService: VideodersService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.projeId) {
      this.loadVideoDersler();
    }
  }

  loadVideoDersler(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.videodersService.getByProjeId(this.projeId).subscribe({
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