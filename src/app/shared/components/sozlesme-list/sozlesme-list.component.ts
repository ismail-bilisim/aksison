import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SozlesmeVideoDersService } from 'src/app/core/services/api/sozlesme-videoders.service';
import { SozlesmeVideoDersResponse } from 'src/app/core/models/sozlesme-videoders-response';

@Component({
  selector: 'app-sozlesme-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sozlesme-list.component.html',
  styleUrl: './sozlesme-list.component.css'
})
export class SozlesmeListComponent implements OnInit {
  @Input() dersId!: number;
  @Output() select = new EventEmitter<SozlesmeVideoDersResponse>();

  items: SozlesmeVideoDersResponse[] = [];
  loading = false;

  private readonly sozlesmeService = inject(SozlesmeVideoDersService);

  ngOnInit(): void {
    this.loadSozlesmeler();
  }

  loadSozlesmeler(): void {
    if (!this.dersId) return;
    this.loading = true;
    this.sozlesmeService.getAllByDersId(this.dersId).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  reload(): void {
    this.loadSozlesmeler();
  }

  onSelect(item: SozlesmeVideoDersResponse): void {
    this.select.emit(item);
  }
}
