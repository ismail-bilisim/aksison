import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EtkinlikOrganizasyonIslemKayitResponse } from '../../models/etkinlik-organizasyon-islem-kayit-response';

@Injectable({ providedIn: 'root' })
export class EtkinlikOrganizasyonIslemKayitService {
  private readonly apiUrl = `${environment.apiUrl}/etkinlikorganizasyon-islemkayit`;

  constructor(private readonly http: HttpClient) {}

  getByEtkinlikOrganizasyonId(etkinlikOrganizasyonId: number): Observable<EtkinlikOrganizasyonIslemKayitResponse[]> {
    return this.http.get<EtkinlikOrganizasyonIslemKayitResponse[]>(`${this.apiUrl}/by-etkinlikorganizasyon/${etkinlikOrganizasyonId}`);
  }

  getById(id: number): Observable<EtkinlikOrganizasyonIslemKayitResponse> {
    return this.http.get<EtkinlikOrganizasyonIslemKayitResponse>(`${this.apiUrl}/${id}`);
  }
}
