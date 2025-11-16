
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videoders-kategori-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoders-kategori-list.component.html',
  styleUrl: './videoders-kategori-list.component.html'
})
export class VideodersKategoriListComponent implements OnInit {
  @Input() dersId!: number;
  items: any[] = [];

  ngOnInit() {
    // Service ile verileri çek: /api/videoderskategori/by-ders/{dersId}
  }
}