import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideodersSorumlular } from '../../../../core/models/videoders-sorumlular';
import { VideodersService } from '../../../../core/services/api/videoders.service';

@Component({
  selector: 'app-videoders-sorumlular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-sorumlular.component.html',
  styleUrls: ['./videoders-sorumlular.component.css']
})
export class VideodersSorumlularComponent implements OnInit {
  @Input() dersId!: number;
  
  sorumlular?: VideodersSorumlular;
  loading = false;
  error?: string;

  constructor(private videodersService: VideodersService) {}

  ngOnInit() {
    if (this.dersId) {
      this.loadSorumlular();
    }
  }

  private loadSorumlular() {
    this.loading = true;
    this.videodersService.getSorumlular(this.dersId).subscribe({
      next: (data) => {
        this.sorumlular = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Sorumlular yüklenemedi:', err);
        this.error = 'Sorumlular yüklenirken hata oluştu.';
        this.loading = false;
      }
    });
  }
}
