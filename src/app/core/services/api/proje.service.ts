import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProjeOzet } from '../../models/proje-ozet';
import { ProjeResponse } from '../../models/proje-response';
import { ProjeRequest } from '../../models/proje-request';

@Injectable({
  providedIn: 'root'
})
export class ProjeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/proje`;

  getAllOzet(): Observable<ProjeOzet[]> {
    return this.http.get<ProjeOzet[]>(`${this.apiUrl}/ozet`);
  }

  getByOnayDurumu(onayDurumu: string): Observable<ProjeOzet[]> {
    return this.http.get<ProjeOzet[]>(`${this.apiUrl}/by-onay/${onayDurumu}`);
  }

  getById(id: number): Observable<ProjeResponse> {
    return this.http.get<ProjeResponse>(`${this.apiUrl}/${id}`);
  }

  create(proje: ProjeRequest): Observable<ProjeResponse> {
    return this.http.post<ProjeResponse>(this.apiUrl, proje);
  }

  update(id: number, proje: ProjeRequest): Observable<ProjeResponse> {
    return this.http.put<ProjeResponse>(`${this.apiUrl}/${id}`, proje);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  icerikOnayinaSun(id: number): Observable<ProjeResponse> {
    return this.http.put<ProjeResponse>(`${this.apiUrl}/${id}/icerik-onaya-sun`, {});
  }

  icerikOnayla(id: number): Observable<ProjeResponse> {
    return this.http.put<ProjeResponse>(`${this.apiUrl}/${id}/icerik-onayla`, {});
  }

  icerikReddet(id: number): Observable<ProjeResponse> {
    return this.http.put<ProjeResponse>(`${this.apiUrl}/${id}/icerik-reddet`, {});
  }
}
