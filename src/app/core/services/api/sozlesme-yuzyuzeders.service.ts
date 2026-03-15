import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SozlesmeDersResponse } from '../../models/sozlesme-ders-response';
import { SozlesmeDersRequest } from '../../models/sozlesme-ders-request';


@Injectable({ providedIn: 'root' })
export class SozlesmeYuzyuzeDersService {
  private apiUrl = `${environment.apiUrl}/sozlesmeyuzyuzeders`;

  constructor(private http: HttpClient) {}

  getSablon(egitmenId: number, dersId: number, baslangicTarihi: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/sablon`, {
      params: { egitmenId, dersId, baslangicTarihi },
      responseType: 'text'
    });
  }

  create(request: SozlesmeDersRequest): Observable<SozlesmeDersResponse> {
    return this.http.post<SozlesmeDersResponse>(this.apiUrl, request);
  }

  getAllByDersId(dersId: number): Observable<SozlesmeDersResponse[]> {
    return this.http.get<SozlesmeDersResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  getAllByEgitmenId(egitmenId: number): Observable<SozlesmeDersResponse[]> {
    return this.http.get<SozlesmeDersResponse[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }

  imzala(id: number): Observable<SozlesmeDersResponse> {
    return this.http.put<SozlesmeDersResponse>(`${this.apiUrl}/${id}/imzala`, {});
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  delete(egitmenId: number, dersId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { params: { egitmenId, dersId } });
  }
}
