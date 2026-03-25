import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EtkinlikOrganizasyonRequest } from '../../models/etkinlik-organizasyon-request';
import { EtkinlikOrganizasyonResponse } from '../../models/etkinlik-organizasyon-response';
import { EtkinlikOrganizasyonOzet } from '../../models/etkinlik-organizasyon-ozet';

@Injectable({ providedIn: 'root' })
export class EtkinlikOrganizasyonService {
  private readonly apiUrl = `${environment.apiUrl}/etkinlikorganizasyon`;

  constructor(private readonly http: HttpClient) {}

  // ==================== CRUD ====================

  create(request: EtkinlikOrganizasyonRequest): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.post<EtkinlikOrganizasyonResponse>(this.apiUrl, request);
  }

  update(id: number, request: EtkinlikOrganizasyonRequest): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.put<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}`, request);
  }

  getById(id: number): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.get<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<EtkinlikOrganizasyonOzet[]> {
    return this.http.get<EtkinlikOrganizasyonOzet[]>(this.apiUrl);
  }

  getByDurumKodu(durumKodu: string): Observable<EtkinlikOrganizasyonOzet[]> {
    return this.http.get<EtkinlikOrganizasyonOzet[]>(`${this.apiUrl}/by-durum/${durumKodu}`);
  }

  // ==================== Workflow ====================

  onayaSun(id: number, aciklama?: string): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.put<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}/onaya-sun`, { aciklama });
  }

  onayla(id: number, aciklama?: string): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.put<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}/onayla`, { aciklama });
  }

  reddet(id: number, aciklama?: string): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.put<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}/reddet`, { aciklama });
  }

  tamamla(id: number, aciklama?: string): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.put<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}/tamamla`, { aciklama });
  }

  iptalEt(id: number, aciklama?: string): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.put<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}/iptal`, { aciklama });
  }

  // ==================== Sorumlu Atama ====================

  sorumluAta(id: number, etkinlikYoneticisiId?: number, grafikDuzenleyiciId?: number, medyaSorumluId?: number): Observable<EtkinlikOrganizasyonResponse> {
    return this.http.put<EtkinlikOrganizasyonResponse>(`${this.apiUrl}/${id}/sorumlu-ata`, {
      etkinlikYoneticisiId, grafikDuzenleyiciId, medyaSorumluId
    });
  }
}
