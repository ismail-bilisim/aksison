import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProsedurRequest } from '../../models/prosedur-request';
import { ProsedurResponse } from '../../models/prosedur-response';
import { ProsedurOzet } from '../../models/prosedur-ozet';

@Injectable({ providedIn: 'root' })
export class ProsedurService {
  private readonly apiUrl = `${environment.apiUrl}/prosedur`;

  constructor(private readonly http: HttpClient) {}

  // ==================== CRUD ====================

  create(request: ProsedurRequest): Observable<ProsedurResponse> {
    return this.http.post<ProsedurResponse>(this.apiUrl, request);
  }

  update(id: number, request: ProsedurRequest): Observable<ProsedurResponse> {
    return this.http.put<ProsedurResponse>(`${this.apiUrl}/${id}`, request);
  }

  getById(id: number): Observable<ProsedurResponse> {
    return this.http.get<ProsedurResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ProsedurOzet[]> {
    return this.http.get<ProsedurOzet[]>(this.apiUrl);
  }

  getByDurumKodu(durumKodu: string): Observable<ProsedurOzet[]> {
    return this.http.get<ProsedurOzet[]>(`${this.apiUrl}/by-durum/${durumKodu}`);
  }

  getBySurecTuruKodu(surecTuruKodu: string): Observable<ProsedurOzet[]> {
    return this.http.get<ProsedurOzet[]>(`${this.apiUrl}/by-tur/${surecTuruKodu}`);
  }

  // ==================== Workflow ====================

  onayaSun(id: number, aciklama?: string): Observable<ProsedurResponse> {
    return this.http.put<ProsedurResponse>(`${this.apiUrl}/${id}/onaya-sun`, { aciklama });
  }

  onayla(id: number, aciklama?: string): Observable<ProsedurResponse> {
    return this.http.put<ProsedurResponse>(`${this.apiUrl}/${id}/onayla`, { aciklama });
  }

  reddet(id: number, aciklama?: string): Observable<ProsedurResponse> {
    return this.http.put<ProsedurResponse>(`${this.apiUrl}/${id}/reddet`, { aciklama });
  }

  mulgaYap(id: number, aciklama?: string): Observable<ProsedurResponse> {
    return this.http.put<ProsedurResponse>(`${this.apiUrl}/${id}/mulga-yap`, { aciklama });
  }

  iptalEt(id: number, aciklama?: string): Observable<ProsedurResponse> {
    return this.http.put<ProsedurResponse>(`${this.apiUrl}/${id}/iptal-et`, { aciklama });
  }
}
