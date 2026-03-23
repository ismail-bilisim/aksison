import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CanliDersRequest } from '../../models/canliders-request';
import { CanliDersResponse } from '../../models/canliders-response';
import { DersOzet } from '../../models/ders-ozet';
import { UcretBilgisiGirRequest } from '../../models/ucret-bilgisi-gir-request';

@Injectable({
  providedIn: 'root'
})
export class CanlidersService {
  private readonly apiUrl = `${environment.apiUrl}/canliders`;

  constructor(private readonly http: HttpClient) { }

  getById(id: number): Observable<CanliDersResponse> {
    return this.http.get<CanliDersResponse>(`${this.apiUrl}/${id}`);
  }

  getByKodu(kodu: number): Observable<CanliDersResponse> {
    return this.http.get<CanliDersResponse>(`${this.apiUrl}/by-kod/${kodu}`);
  }

  create(request: CanliDersRequest): Observable<CanliDersResponse> {
    return this.http.post<CanliDersResponse>(this.apiUrl, request);
  }

  update(id: number, request: CanliDersRequest): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllByDurum(durum: string): Observable<CanliDersResponse[]> {
    return this.http.get<CanliDersResponse[]>(`${this.apiUrl}/by-durum/${durum}`);
  }

  getAllOzet(): Observable<CanliDersResponse[]> {
    return this.http.get<CanliDersResponse[]>(`${this.apiUrl}/all-ozet`);
  }

  // ==================== Workflow Methods ====================

  baslatmaOnayinaSun(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/baslatma-onaya-sun`, {});
  }

  baslatmaOnayla(id: number, onayNotu?: string): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/baslatma-onayla`, onayNotu );
  }

  baslatmaReddet(id: number, redNedeni?: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/baslatma-reddet`, redNedeni );
  }

  icerigiEgitmeneGonder(id: number, not?: string): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/icerik-egitmene-gonder`, not);
  }

  icerigiOnayaSun(id: number, not?: string): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/icerik-onaya-sun`, not);
  }

  icerikOnayla(id: number, not?: string): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/icerik-onayla`, not);
  }

  icerikReddet(id: number, not?: string): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/icerik-reddet`, not);
  }

  ucretBilgisiGir(id: number, request: UcretBilgisiGirRequest): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/ucret-bilgisi-gir`, request);
  }

  sozlesmeTalepEt(id: number, not?: string): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/sozlesme-talep-et`, not);
  }

  iptalEt(id: number, not?: string): Observable<CanliDersResponse> {
    return this.http.put<CanliDersResponse>(`${this.apiUrl}/${id}/iptal-et`, not);
  }

  // ==================== Query Methods ====================

  getByDersId(dersId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  getByKategoriler(kategoriIds: number[]): Observable<DersOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }

  getAllOzetByKategori(kategoriId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategori/${kategoriId}`);
  }

  getAllByPaydas(paydasId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-paydas/${paydasId}`);
  }

  getByProjeId(projeId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-proje/${projeId}`);
  }

  getByEgitmenId(egitmenId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }
}
