import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
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

    this.http
      .post<{ token: string }>(`${environment.authUrl}/login`, this.form.value)
      .subscribe({
        next: (res) => {
          this.auth.login(res.token);
          this.router.navigate(['/']); // login sonrası anasayfaya yönlendir
        },
        error: () => {
          this.error = 'Kullanıcı adı veya şifre hatalı';
          this.loading = false;
        },
      });
  }
}
