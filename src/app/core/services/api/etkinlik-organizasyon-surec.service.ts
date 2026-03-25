import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EtkinlikOrganizasyonSurecRequest } from '../../models/etkinlik-organizasyon-surec-request';
import { EtkinlikOrganizasyonSurecResponse } from '../../models/etkinlik-organizasyon-surec-response';

@Injectable({ providedIn: 'root' })
export class EtkinlikOrganizasyonSurecService {
  private readonly apiUrl = `${environment.apiUrl}/etkinlikorganizasyon-surec`;

  constructor(private readonly http: HttpClient) {}

  create(request: EtkinlikOrganizasyonSurecRequest): Observable<EtkinlikOrganizasyonSurecResponse> {
    return this.http.post<EtkinlikOrganizasyonSurecResponse>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByEtkinlikOrganizasyonId(etkinlikOrganizasyonId: number): Observable<EtkinlikOrganizasyonSurecResponse[]> {
    return this.http.get<EtkinlikOrganizasyonSurecResponse[]>(`${this.apiUrl}/by-etkinlikorganizasyon/${etkinlikOrganizasyonId}`);
  }

  getById(id: number): Observable<EtkinlikOrganizasyonSurecResponse> {
    return this.http.get<EtkinlikOrganizasyonSurecResponse>(`${this.apiUrl}/${id}`);
  }
}
