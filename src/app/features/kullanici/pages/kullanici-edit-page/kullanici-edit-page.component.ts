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
    if (this.kullanici?.tcKimlikNo) {
      // Update existing user - API requires tcKimlikNo as string
      // Orijinal kullanıcı verisini form verileriyle birleştir
      const updatedKullanici: any = {
        ...k,
        version: this.kullanici.version
      };
      
      // Şifre boşsa, backend validation hatası almamak için çıkar
      if (!updatedKullanici.sifre || updatedKullanici.sifre.trim() === '') {
        delete updatedKullanici.sifre;
      }
      
      // id alanını çıkar (backend RequestDTO'da yok)
      delete updatedKullanici.id;
      
      console.log('Güncelleme için gönderilen veri:', updatedKullanici);
      
      this.kullaniciService
        .update(this.kullanici.tcKimlikNo.toString(), updatedKullanici)
        .subscribe({
          next: () => this.router.navigate(['/kullanici']),
          error: (err) => {
            console.error('Güncelleme hatası:', err);
            this.error = err?.error?.message || err?.message || 'Kullanıcı güncellenirken hata oluştu.';
          }
        });
    } else {
      // Create new user
      const newKullanici: any = { ...k };
      
      // id alanını çıkar
      delete newKullanici.id;
      delete newKullanici.version;
      
      console.log('Yeni kullanıcı için gönderilen veri:', newKullanici);
      
      this.kullaniciService
        .create(newKullanici)
        .subscribe({
          next: () => this.router.navigate(['/kullanici']),
          error: (err) => {
            console.error('Ekleme hatası:', err);
            this.error = err?.error?.message || err?.message || 'Kullanıcı eklenirken hata oluştu.';
          }
        });
    }
  }
}
