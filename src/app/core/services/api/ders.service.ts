import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DersRequest } from 'src/app/core/models/ders-request';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { DersResponse } from '../../models/ders-response';

@Injectable({ providedIn: 'root' })
export class DersService {
  private apiUrl = `${environment.apiUrl}/ders`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(this.apiUrl);
  }

  getAllOzet(): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/all-ozet`);
  }

  getById(id: number): Observable<DersResponse> {
    return this.http.get<DersResponse>(`${this.apiUrl}/${id}`);
  }

  getByKodu(kodu: number): Observable<DersResponse> {
    return this.http.get<DersResponse>(`${this.apiUrl}/by-kodu/${kodu}`);
  }

  getByAdi(adi: string): Observable<DersResponse> {
    return this.http.get<DersResponse>(`${this.apiUrl}/by-adi/${adi}`);
  }

  getByOnayDurumu(onayDurumu: string): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-onay/${onayDurumu}`);
  }

  getByIcerikYoneticisi(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-icerik-yoneticisi/${kullaniciId}`);
  }

  create(ders: DersRequest): Observable<DersResponse> {
    return this.http.post<DersResponse>(this.apiUrl, ders);
  }

  update(id: number, ders: DersRequest): Observable<DersResponse> {
    return this.http.put<DersResponse>(`${this.apiUrl}/${id}`, ders);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //TODO: onays sonrasi donen deger ile birsey yapilacak mi yoksa id le yeniden sorgulama ve yonlendirme yeterli mi?
  baslatmaOnayinaSun(id: number): Observable<DersResponse> {
    return this.http.put<DersResponse>(`${this.apiUrl}/${id}/baslatma-onaya-sun`, {});
  }

  baslatmaOnayla(id: number, onayNotu?: string): Observable<DersResponse> {
    return this.http.put<DersResponse>(`${this.apiUrl}/${id}/baslatma-onayla`, onayNotu || null);
  }

  baslatmaReddet(id: number, redNedeni?: string): Observable<DersResponse> {
    return this.http.put<DersResponse>(`${this.apiUrl}/${id}/baslatma-reddet`, redNedeni || null);
  }

  getByKategoriler(kategoriIds: number[]): Observable<DersOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }

}
