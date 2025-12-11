import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EgitmenOzet } from '../../models/egitmen-ozet';

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

  getByKategoriler(kategoriIds: number[]): Observable<EgitmenOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }
}
