import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TalepRequest } from '../../models/talep-request';
import { TalepResponse } from '../../models/talep-response';
import { TalepOzet } from '../../models/talep-ozet';
import { TalepStatistics } from '../../models/talep-statistics';

@Injectable({
  providedIn: 'root'
})
export class TalepService {
  private apiUrl = `${environment.apiUrl}/talep`;

  constructor(private http: HttpClient) { }

  create(request: TalepRequest): Observable<TalepResponse> {
    return this.http.post<TalepResponse>(this.apiUrl, request);
  }

  update(id: number, request: TalepRequest): Observable<TalepResponse> {
    return this.http.put<TalepResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<TalepResponse> {
    return this.http.get<TalepResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<TalepResponse[]> {
    return this.http.get<TalepResponse[]>(this.apiUrl);
  }

  getAllOzet(): Observable<TalepOzet[]> {
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/ozet`);
  }

  getStatistics(startDate: string, endDate: string): Observable<TalepStatistics> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepStatistics>(`${this.apiUrl}/statistics`, { params });
  }

  getTaleplerByAtananKisi(kullaniciId: number, startDate: string, endDate: string): Observable<TalepOzet[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/atanan/${kullaniciId}`, { params });
  }

  getMyTalepler(startDate: string, endDate: string): Observable<TalepOzet[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/my-talepler`, { params });
  }

  getTaleplerByDurumu(durumKodu: string, startDate: string, endDate: string): Observable<TalepOzet[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/by-durumu/${durumKodu}`, { params });
  }

  assignTalep(id: number, kullaniciId: number): Observable<TalepResponse> {
    let params = new HttpParams()
      .set('kullaniciId', kullaniciId.toString());
    return this.http.post<TalepResponse>(`${this.apiUrl}/${id}/assign`, {}, { params });
  }

  icerikOnayinaSun(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-onaya-sun`, {});
  }

  icerikOnayla(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-onayla`, {});
  }

  icerikReddet(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-reddet`, {});
  }
}