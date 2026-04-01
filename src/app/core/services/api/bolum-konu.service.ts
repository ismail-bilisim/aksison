import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BolumKonuResponse, BolumKonuRequest } from '../../models/ders-bolum';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BolumKonuService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bolum-konu`;

  create(request: BolumKonuRequest): Observable<BolumKonuResponse> {
    return this.http.post<BolumKonuResponse>(this.apiUrl, request);
  }

  getAllByBolumId(bolumId: number): Observable<BolumKonuResponse[]> {
    return this.http.get<BolumKonuResponse[]>(`${this.apiUrl}/by-bolum/${bolumId}`);
  }

  getAllByBolumIdOrdered(bolumId: number): Observable<BolumKonuResponse[]> {
    return this.http.get<BolumKonuResponse[]>(`${this.apiUrl}/by-bolum/${bolumId}/ordered`);
  }

  getAllByBolumIdsOrdered(bolumIds: number[]): Observable<Record<number, BolumKonuResponse[]>> {
    const params = new HttpParams().set('bolumIds', bolumIds.join(','));
    return this.http.get<Record<number, BolumKonuResponse[]>>(`${this.apiUrl}/by-bolumlar`, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  moveKonu(konuId: number, oncekiSiraNo: number | null, sonrakiSiraNo: number | null): Observable<void> {
    let params = new HttpParams();
    if (oncekiSiraNo !== null) {
      params = params.set('oncekiSiraNo', oncekiSiraNo.toString());
    }
    if (sonrakiSiraNo !== null) {
      params = params.set('sonrakiSiraNo', sonrakiSiraNo.toString());
    }
    return this.http.put<void>(`${this.apiUrl}/${konuId}/move`, null, { params });
  }

  rebalanceKonular(bolumId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bolum/${bolumId}/rebalance`, null);
  }
}