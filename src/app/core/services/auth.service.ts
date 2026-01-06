import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token'; // 'token' yerine 'access_token'

  constructor(private router: Router) {}

  login(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  logout(redirect: boolean = true): void {
    this.clearStoredSession();
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  private clearStoredSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    const info = this.getUserInfo();
    return info?.userId || info?.id || info?.sub || null;
  }

  getUserRoles(): string[] {
    const info = this.getUserInfo();
    return info?.authorities || info?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasAnyRole(...roles: string[]): boolean { //Parametreler otomatik olarak diziye çevrilir
    const userRoles = this.getUserRoles();
    return roles.some(r => userRoles.includes(r));
  }


}

