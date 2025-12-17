import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DersBolumResponse, DersBolumRequest } from '../../models/ders-bolum';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DersBolumService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ders-bolum`;

  create(request: DersBolumRequest): Observable<DersBolumResponse> {
    return this.http.post<DersBolumResponse>(this.apiUrl, request);
  }

  getAllByDersId(dersId: number): Observable<DersBolumResponse[]> {
    return this.http.get<DersBolumResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  getAllByDersIdOrdered(dersId: number): Observable<DersBolumResponse[]> {
    return this.http.get<DersBolumResponse[]>(`${this.apiUrl}/by-ders/${dersId}/ordered`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  moveBolum(dersBolumId: number, oncekiSiraNo: number | null, sonrakiSiraNo: number | null): Observable<void> {
    let params = new HttpParams();
    if (oncekiSiraNo !== null) {
      params = params.set('oncekiSiraNo', oncekiSiraNo.toString());
    }
    if (sonrakiSiraNo !== null) {
      params = params.set('sonrakiSiraNo', sonrakiSiraNo.toString());
    }
    return this.http.put<void>(`${this.apiUrl}/${dersBolumId}/move`, null, { params });
  }

  rebalanceBolumlar(dersId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/ders/${dersId}/rebalance`, null);
  }
}