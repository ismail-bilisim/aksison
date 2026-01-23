import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { YuzyuzeDersRequest } from '../../models/yuzyuzeders-request';
import { YuzyuzeDersResponse } from '../../models/yuzyuzeders-response';

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
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-onayina-sun`, {});
  }

  icerikOnayla(id: number, onayNotu?: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-onayla`, { onayNotu });
  }

  icerikReddet(id: number, redNedeni?: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-reddet`, { redNedeni });
  }
}
