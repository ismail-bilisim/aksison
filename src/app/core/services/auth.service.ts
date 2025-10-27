import { Injectable } from '@angular/core';
import { ROLE_ACCESS_MAP, ActionType, ResourceType } from '../config/authorization.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

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

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
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
    return info?.roles || info?.authorities || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * İşlem bazlı erişim kontrolü
   * örn: hasAccess('VIDEODERS', 'EDIT')
   */
  //TODO: 
//Örnek Kullanım:
//    @if(auth.hasAccess('VIDEODERS', 'CREATE')) {
//   <button class="btn btn-success"(click) = "onAdd()" > Yeni Ekle </button>}
  // @if(auth.hasAccess('VIDEODERS', 'DELETE')) {
  // <button class="btn btn-danger"(click) = "onDelete(v.kodu)" > Sil </button>}

  hasAccess(resource: ResourceType, action: ActionType): boolean {
    const roles = this.getUserRoles();
    if (!roles?.length) return false;

    return roles.some(role => {
      const roleAccess = ROLE_ACCESS_MAP[role];
      const allowedActions = roleAccess?.[resource];
      return allowedActions?.includes(action);
    });
  }

}

