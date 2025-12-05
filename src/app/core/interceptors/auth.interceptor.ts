import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  // Login ve public endpoint'leri atla
  const isLoginRequest = req.url.includes('/login') || req.url.includes('/register');

  // Token varsa ve login isteği değilse isteğe ekle
  let authReq = req;
  if (token && !isLoginRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Login sayfasındaki hataları yönetme
      if (error.status === 401 && !isLoginRequest) {
        console.warn('401 Unauthorized - Kullanıcı oturumu sonlandırılıyor');

        auth.logout();

        // Login sayfasına yönlendir
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};

