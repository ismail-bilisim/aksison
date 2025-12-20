import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaydasOzet } from '../../models/paydas-ozet';
import { PaydasResponse } from '../../models/paydas-response';
import { PaydasRequest } from '../../models/paydas-request';

@Injectable({
  providedIn: 'root'
})
export class PaydasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/paydas`;

  getAll(): Observable<PaydasOzet[]> {
    return this.http.get<PaydasOzet[]>(`${this.apiUrl}/ozet`);
  }

  getAllOzet(): Observable<PaydasOzet[]> {
    return this.http.get<PaydasOzet[]>(`${this.apiUrl}/ozet`);
  }

  getByOnayDurumu(onayDurumu: string): Observable<PaydasOzet[]> {
    return this.http.get<PaydasOzet[]>(`${this.apiUrl}/by-onay/${onayDurumu}`);
  }

  getById(id: number): Observable<PaydasResponse> {
    return this.http.get<PaydasResponse>(`${this.apiUrl}/${id}`);
  }

  create(paydas: PaydasRequest): Observable<PaydasResponse> {
    return this.http.post<PaydasResponse>(this.apiUrl, paydas);
  }

  update(id: number, paydas: PaydasRequest): Observable<PaydasResponse> {
    return this.http.put<PaydasResponse>(`${this.apiUrl}/${id}`, paydas);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  icerikOnayinaSun(id: number): Observable<PaydasResponse> {
    return this.http.put<PaydasResponse>(`${this.apiUrl}/${id}/icerik-onaya-sun`, {});
  }

  icerikOnayla(id: number, onayNotu?: string): Observable<PaydasResponse> {
    return this.http.put<PaydasResponse>(`${this.apiUrl}/${id}/icerik-onayla`, {});
  }

  icerikReddet(id: number, redNedeni?: string): Observable<PaydasResponse> {
    return this.http.put<PaydasResponse>(`${this.apiUrl}/${id}/icerik-reddet`, {});
  }
}
