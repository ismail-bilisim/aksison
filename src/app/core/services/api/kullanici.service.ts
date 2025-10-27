import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Kullanici } from '../../models/kullanici';

@Injectable({
  providedIn: 'root'
})
export class KullaniciService {
  private apiUrl = `${environment.apiUrl}/kullanici`;

  constructor(private http: HttpClient) { }

  /**
   * Get all users with optional pagination
   * GET /api/kullanici
   */
  getAll(page?: number, size?: number): Observable<Kullanici[]> {
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (size !== undefined) {
      params = params.set('size', size.toString());
    }
    return this.http.get<Kullanici[]>(this.apiUrl, { params });
  }

  /**
   * Get user by ID
   * GET /api/kullanici/{id}
   */
  getById(id: number): Observable<Kullanici> {
    return this.http.get<Kullanici>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get user by TC Kimlik No
   * GET /api/kullanici/by-tc-kimlik-no/{tcKimlikNo}
   */
  getByTcKimlikNo(tcKimlikNo: string): Observable<Kullanici> {
    return this.http.get<Kullanici>(`${this.apiUrl}/by-tc-kimlik-no/${tcKimlikNo}`);
  }

  /**
   * Get user by username
   * GET /api/kullanici/by-kullanici-adi/{kullaniciAdi}
   */
  getByKullaniciAdi(kullaniciAdi: string): Observable<Kullanici> {
    return this.http.get<Kullanici>(`${this.apiUrl}/by-kullanici-adi/${kullaniciAdi}`);
  }

  /**
   * Get users by name and surname
   * GET /api/kullanici/by-ad-soyad
   */
  getByAdSoyad(ad: string, soyad: string): Observable<Kullanici[]> {
    const params = new HttpParams()
      .set('ad', ad)
      .set('soyad', soyad);
    return this.http.get<Kullanici[]>(`${this.apiUrl}/by-ad-soyad`, { params });
  }

  /**
   * Create new user
   * POST /api/kullanici
   */
  create(kullanici: Kullanici): Observable<Kullanici> {
    return this.http.post<Kullanici>(this.apiUrl, kullanici);
  }

  /**
   * Update existing user
   * PUT /api/kullanici/{tcKimlikNo}
   */
  update(tcKimlikNo: string, kullanici: Kullanici): Observable<Kullanici> {
    return this.http.put<Kullanici>(`${this.apiUrl}/${tcKimlikNo}`, kullanici);
  }

  /**
   * Delete user
   * DELETE /api/kullanici/{tcKimlikNo}
   */
  delete(tcKimlikNo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tcKimlikNo}`);
  }
}

