import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EtkinlikOrganizasyonBasvuruRequest } from '../../models/etkinlik-organizasyon-basvuru-request';
import { EtkinlikOrganizasyonBasvuruResponse } from '../../models/etkinlik-organizasyon-basvuru-response';

@Injectable({ providedIn: 'root' })
export class EtkinlikOrganizasyonBasvuruService {
  private readonly apiUrl = `${environment.apiUrl}/etkinlikorganizasyon-basvuru`;

  constructor(private readonly http: HttpClient) {}

  create(request: EtkinlikOrganizasyonBasvuruRequest): Observable<EtkinlikOrganizasyonBasvuruResponse> {
    return this.http.post<EtkinlikOrganizasyonBasvuruResponse>(this.apiUrl, request);
  }

  getAllByEtkinlikOrganizasyonId(etkinlikOrganizasyonId: number): Observable<EtkinlikOrganizasyonBasvuruResponse[]> {
    return this.http.get<EtkinlikOrganizasyonBasvuruResponse[]>(`${this.apiUrl}/by-etkinlikorganizasyon/${etkinlikOrganizasyonId}`);
  }
}
