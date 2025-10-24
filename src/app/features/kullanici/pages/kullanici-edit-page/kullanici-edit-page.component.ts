import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KullaniciService } from 'src/app/core/services/api/kullanici.service';
import { Kullanici } from 'src/app/core/models/kullanici';
import { KullaniciFormComponent } from '../../components/kullanici-form/kullanici-form.component';

@Component({
  selector: 'app-kullanici-edit-page',
  standalone: true,
  imports: [KullaniciFormComponent],
  templateUrl: './kullanici-edit-page.component.html',
  styleUrl: './kullanici-edit-page.component.css'
})

export class KullaniciEditPageComponent implements OnInit {
  kullanici?: Kullanici;
  loading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private kullaniciService: KullaniciService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.kullaniciService.getById(+id).subscribe({
        next: (res) => (this.kullanici = res),
        error: (err) => (this.error = err?.message || 'Kullanıcı yüklenirken hata oluştu.'),
        complete: () => (this.loading = false),
      });
    }
  }

  onSave(k: Kullanici) {
    if (this.kullanici?.id) {
      this.kullaniciService
        .update(this.kullanici.id, k)
        .subscribe(() => this.router.navigate(['/kullanicilar']));
    } else {
      this.kullaniciService
        .create(k)
        .subscribe(() => this.router.navigate(['/kullanicilar']));
    }
  }
}
