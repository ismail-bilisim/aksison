import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TalepKonusuRequest } from '../../models/talep-konusu-request';
import { TalepKonusuOzet, TalepKonusuResponse } from '../../models/talep-konusu';

@Injectable({
  providedIn: 'root'
})
export class TalepKonusuService {
  private apiUrl = `${environment.apiUrl}/talepkonusu`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TalepKonusuResponse[]> {
    return this.http.get<TalepKonusuResponse[]>(this.apiUrl);
  }

  getAllOzet(): Observable<TalepKonusuOzet[]> {
    return this.http.get<TalepKonusuOzet[]>(`${this.apiUrl}/ozet`);
  }

  getById(id: number): Observable<TalepKonusuResponse> {
    return this.http.get<TalepKonusuResponse>(`${this.apiUrl}/${id}`);
  }

  getByKodu(kodu: string): Observable<TalepKonusuResponse> {
    return this.http.get<TalepKonusuResponse>(`${this.apiUrl}/by-kodu/${kodu}`);
  }

  create(request: TalepKonusuRequest): Observable<TalepKonusuResponse> {
    return this.http.post<TalepKonusuResponse>(this.apiUrl, request);
  }

  update(id: number, request: TalepKonusuRequest): Observable<TalepKonusuResponse> {
    return this.http.put<TalepKonusuResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
