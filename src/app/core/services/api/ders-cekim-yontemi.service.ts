import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DersCekimYontemiResponse } from '../../models/ders-cekim-yontemi-response';

@Injectable({
  providedIn: 'root'
})
export class DersCekimYontemiService {
  private baseUrl = `${environment.apiUrl}/ders-cekim-yontemleri`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DersCekimYontemiResponse[]> {
    return this.http.get<DersCekimYontemiResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<DersCekimYontemiResponse> {
    return this.http.get<DersCekimYontemiResponse>(`${this.baseUrl}/${id}`);
  }

  getByKodu(kodu: string): Observable<DersCekimYontemiResponse> {
    return this.http.get<DersCekimYontemiResponse>(`${this.baseUrl}/kodu/${kodu}`);
  }
}
