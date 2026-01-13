import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DersIslemKayit } from 'src/app/core/models/ders-islem-kayit';

@Component({
  selector: 'app-ders-islem-kayit-list',
  imports: [CommonModule],
  templateUrl: './ders-islem-kayit-list.component.html',
  styleUrl: './ders-islem-kayit-list.component.css'
})
export class DersIslemKayitListComponent {
  @Input() items: DersIslemKayit[] = [];
  @Input() isLoading = false;
}
