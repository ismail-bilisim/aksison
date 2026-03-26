import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Kullanici } from '../../models/kullanici';
import { KullaniciOzet } from '../../models/kullanici-ozet';

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
   * Get all users as summary DTOs
   * GET /api/kullanici/ozet
   */
  getAllOzet(): Observable<KullaniciOzet[]> {
    return this.http.get<KullaniciOzet[]>(`${this.apiUrl}/ozet`);
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

  /**
   * Get user summary by ID
   * GET /api/kullanici/ozet/{id}
   */
  getOzetById(id: number): Observable<KullaniciOzet> {
    return this.http.get<KullaniciOzet>(`${this.apiUrl}/ozet/${id}`);
  }

  /**
   * Search users by TC Kimlik No or name (partial match)
   * GET /api/kullanici/search?q=12345
   * Limited to 20 results for performance
   * Empty search term returns empty observable
   */
  searchKullanicilar(searchTerm: string): Observable<KullaniciOzet[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    const params = new HttpParams().set('q', searchTerm.trim());
    return this.http.get<KullaniciOzet[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get users by role codes
   * GET /api/kullanici/by-rol?rolKodlari=ETGRV,ETYON
   */
  getByRolKodlari(rolKodlari: string[]): Observable<KullaniciOzet[]> {
    const params = new HttpParams().set('rolKodlari', rolKodlari.join(','));
    return this.http.get<KullaniciOzet[]>(`${this.apiUrl}/by-rol`, { params });
  }
}

