import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { YuzyuzeDersRequest } from '../../models/yuzyuzeders-request';
import { YuzyuzeDersResponse } from '../../models/yuzyuzeders-response';
import { DersOzet } from '../../models/ders-ozet';

@Injectable({
  providedIn: 'root'
})
export class YuzyuzedersService {
  private readonly apiUrl = `${environment.apiUrl}/yuzyuzeders`;

  constructor(private readonly http: HttpClient) { }

  getById(id: number): Observable<YuzyuzeDersResponse> {
    return this.http.get<YuzyuzeDersResponse>(`${this.apiUrl}/${id}`);
  }

  getByKodu(kodu: number): Observable<YuzyuzeDersResponse> {
    return this.http.get<YuzyuzeDersResponse>(`${this.apiUrl}/by-kod/${kodu}`);
  }

  create(request: YuzyuzeDersRequest): Observable<YuzyuzeDersResponse> {
    return this.http.post<YuzyuzeDersResponse>(this.apiUrl, request);
  }

  update(id: number, request: YuzyuzeDersRequest): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllByDurum(durum: string): Observable<YuzyuzeDersResponse[]> {
    return this.http.get<YuzyuzeDersResponse[]>(`${this.apiUrl}/by-durum/${durum}`);
  }

  getAllByOnayKodu(onayKodu: string): Observable<YuzyuzeDersResponse[]> {
    return this.http.get<YuzyuzeDersResponse[]>(`${this.apiUrl}/by-onay/${onayKodu}`);
  }

  getAllOzet(): Observable<YuzyuzeDersResponse[]> {
    return this.http.get<YuzyuzeDersResponse[]>(`${this.apiUrl}/all-ozet`);
  }

  icerikOnayinaSun(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-onaya-sun`, {});
  }

  icerikOnayla(id: number, onayNotu?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/icerik-onayla`, { onayNotu });
  }

  icerikReddet(id: number, redNedeni?: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-reddet`, { redNedeni });
  }

  // GET by Ders ID - for listing video lessons related to a parent course
  getByDersId(dersId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  // GET by multiple kategori
  getByKategoriler(kategoriIds: number[]): Observable<DersOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }

  // GET by only one kategori
  getAllOzetByKategori(kategoriId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategori/${kategoriId}`);
  }


  // GET by Paydas ID - for listing yuzyuze lessons related to a paydas
  getAllByPaydas(paydasId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-paydas/${paydasId}`);
  }

  // GET by Proje ID - for listing yuzyuze lessons related to a proje
  getByProjeId(projeId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-proje/${projeId}`);
  }


  // GET by Egitmen ID - for listing yuzyuze lessons related to an egitmen
  getByEgitmenId(egitmenId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }
}
