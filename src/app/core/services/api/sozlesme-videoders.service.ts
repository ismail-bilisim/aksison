import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SozlesmeVideoDersResponse } from '../../models/sozlesme-videoders-response';

export interface SozlesmeVideoDersRequest {
  dersId: number;
  egitmenId: number;
  baslangicTarihi: string;
  sozlesmeDetails: string;
  version?: number;
}

@Injectable({ providedIn: 'root' })
export class SozlesmeVideoDersService {
  private apiUrl = `${environment.apiUrl}/sozlesmevideoders`;

  constructor(private http: HttpClient) {}

  getSablon(egitmenId: number, dersId: number, baslangicTarihi: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/sablon`, {
      params: { egitmenId, dersId, baslangicTarihi },
      responseType: 'text'
    });
  }

  create(request: SozlesmeVideoDersRequest): Observable<SozlesmeVideoDersResponse> {
    return this.http.post<SozlesmeVideoDersResponse>(this.apiUrl, request);
  }

  getAllByDersId(dersId: number): Observable<SozlesmeVideoDersResponse[]> {
    return this.http.get<SozlesmeVideoDersResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  getAllByEgitmenId(egitmenId: number): Observable<SozlesmeVideoDersResponse[]> {
    return this.http.get<SozlesmeVideoDersResponse[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }

  imzala(id: number): Observable<SozlesmeVideoDersResponse> {
    return this.http.put<SozlesmeVideoDersResponse>(`${this.apiUrl}/${id}/imzala`, {});
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  delete(egitmenId: number, dersId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { params: { egitmenId, dersId } });
  }
}
