import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EgitmenOzet } from '../../models/egitmen-ozet';
import { EgitmenResponse } from '../../models/egitmen-response';
import { EgitmenRequest } from '../../models/egitmen-request';

@Injectable({ providedIn: 'root' })
export class EgitmenService {
  private apiUrl = `${environment.apiUrl}/egitmen`;

  constructor(private http: HttpClient) { }

  getAllOzet(): Observable<EgitmenOzet[]> {
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/all-ozet`);
  }

  getById(id: number): Observable<EgitmenOzet> {
    return this.http.get<EgitmenOzet>(`${this.apiUrl}/${id}`);
  }

  getByKod(kod: number): Observable<EgitmenOzet> {
    return this.http.get<EgitmenOzet>(`${this.apiUrl}/by-kod/${kod}`);
  }

  getByKullaniciId(kullaniciId: number): Observable<EgitmenOzet> {
    return this.http.get<EgitmenOzet>(`${this.apiUrl}/by-kullanici/${kullaniciId}`);
  }

  getAllByOnayDurumu(onayDurumu: string): Observable<EgitmenOzet[]> {
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/by-onay/${onayDurumu}`);
  }

  getAllByAktifMi(aktifMi: boolean): Observable<EgitmenOzet[]> {
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/by-aktif/${aktifMi}`);
  }

  searchApproved(query: string): Observable<EgitmenOzet[]> {
    const params: any = {};
    if (query) {
      params['q'] = query;
    }
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/search`, { params });
  }

  getByKategoriler(kategoriIds: number[]): Observable<EgitmenOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }

  // CRUD Operations with full DTO
  create(request: EgitmenRequest): Observable<EgitmenResponse> {
    return this.http.post<EgitmenResponse>(this.apiUrl, request);
  }

  update(id: number, request: EgitmenRequest): Observable<EgitmenResponse> {
    return this.http.put<EgitmenResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFullById(id: number): Observable<EgitmenResponse> {
    return this.http.get<EgitmenResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<EgitmenResponse[]> {
    return this.http.get<EgitmenResponse[]>(this.apiUrl);
  }

  // Approval Workflow Methods
  icerikOnayinaSun(id: number): Observable<EgitmenResponse> {
    return this.http.put<EgitmenResponse>(`${this.apiUrl}/${id}/icerik-onaya-sun`, {});
  }

  icerikOnayla(id: number, aciklama?: string): Observable<EgitmenResponse> {
    let params = new HttpParams();
    if (aciklama) {
      params = params.set('aciklama', aciklama);
    }
    return this.http.put<EgitmenResponse>(`${this.apiUrl}/${id}/icerik-onayla`, {}, { params });
  }

  icerikReddet(id: number, redSebebi?: string): Observable<EgitmenResponse> {
    let params = new HttpParams();
    if (redSebebi) {
      params = params.set('redSebebi', redSebebi);
    }
    return this.http.put<EgitmenResponse>(`${this.apiUrl}/${id}/icerik-reddet`, {}, { params });
  }

  pasifYap(id: number): Observable<EgitmenResponse> {
    return this.http.put<EgitmenResponse>(`${this.apiUrl}/${id}/pasif-yap`, {});
  }

  aktifYap(id: number): Observable<EgitmenResponse> {
    return this.http.put<EgitmenResponse>(`${this.apiUrl}/${id}/aktif-yap`, {});
  }
}
