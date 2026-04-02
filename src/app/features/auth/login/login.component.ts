import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  form: FormGroup;
  loading = false;
  error?: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = undefined;

    console.log('Login isteği gönderiliyor:', this.form.value.username);

    this.http
      .post<any>(`${environment.authUrl}/login`, this.form.value)
      .subscribe({
        next: (res) => {
          console.log('Login response:', res);
          
          // Token'ı farklı yerlerde olabilir: token, access_token, accessToken
          const token = res.access_token || res.token || res.accessToken;
          
          if (token) {
            this.auth.login(token);
            this.router.navigate(['/']);
          } else {
            console.error('Token bulunamadı:', res);
            this.error = 'Giriş başarısız - token alınamadı';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Login hatası:', err);

          if (err.status === 0) {
            this.error = 'Sunucuya bağlanılamadı. Lütfen ağ bağlantınızı veya sunucuyu kontrol edin.';
          } else if (err.status === 401) {
            this.error = 'Kullanıcı adı veya şifre hatalı';
          } else {
            this.error = err.error?.message || 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
          }

          this.loading = false;
        },
      });
  }
}
