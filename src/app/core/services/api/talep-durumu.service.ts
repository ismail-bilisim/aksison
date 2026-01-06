import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TalepDurumuResponse, TalepDurumuOzet } from '../../models/talep-durumu';
import { TalepDurumuRequest } from '../../models/talep-durumu-request';

@Injectable({
  providedIn: 'root'
})
export class TalepDurumuService {
  private apiUrl = `${environment.apiUrl}/talepdurumu`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TalepDurumuResponse[]> {
    return this.http.get<TalepDurumuResponse[]>(this.apiUrl);
  }

  getAllOzet(): Observable<TalepDurumuOzet[]> {
    return this.http.get<TalepDurumuOzet[]>(`${this.apiUrl}/ozet`);
  }

  

  getById(id: number): Observable<TalepDurumuResponse> {
    return this.http.get<TalepDurumuResponse>(`${this.apiUrl}/${id}`);
  }

  getByKodu(kodu: string): Observable<TalepDurumuResponse> {
    return this.http.get<TalepDurumuResponse>(`${this.apiUrl}/by-kodu/${kodu}`);
  }

  create(request: TalepDurumuRequest): Observable<TalepDurumuResponse> {
    return this.http.post<TalepDurumuResponse>(this.apiUrl, request);
  }

  update(id: number, request: TalepDurumuRequest): Observable<TalepDurumuResponse> {
    return this.http.put<TalepDurumuResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
