import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EtkinlikOrganizasyonSurecGorevRequest } from '../../models/etkinlik-organizasyon-surec-gorev-request';
import { EtkinlikOrganizasyonSurecGorevResponse } from '../../models/etkinlik-organizasyon-surec-gorev-response';

@Injectable({ providedIn: 'root' })
export class EtkinlikOrganizasyonSurecGorevService {
  private readonly apiUrl = `${environment.apiUrl}/etkinlikorganizasyon-surec-gorev`;

  constructor(private readonly http: HttpClient) {}

  create(request: EtkinlikOrganizasyonSurecGorevRequest): Observable<EtkinlikOrganizasyonSurecGorevResponse> {
    return this.http.post<EtkinlikOrganizasyonSurecGorevResponse>(this.apiUrl, request);
  }

  gorevliAta(gorevId: number, gorevliId: number): Observable<EtkinlikOrganizasyonSurecGorevResponse> {
    return this.http.put<EtkinlikOrganizasyonSurecGorevResponse>(`${this.apiUrl}/${gorevId}/gorevli-ata`, { gorevliId });
  }

  gorevDurumuGuncelle(gorevId: number, gorevDurumu: string, aciklama?: string): Observable<EtkinlikOrganizasyonSurecGorevResponse> {
    return this.http.put<EtkinlikOrganizasyonSurecGorevResponse>(`${this.apiUrl}/${gorevId}/durum-guncelle`, { gorevDurumu, aciklama });
  }

  getBySurecId(surecId: number): Observable<EtkinlikOrganizasyonSurecGorevResponse[]> {
    return this.http.get<EtkinlikOrganizasyonSurecGorevResponse[]>(`${this.apiUrl}/by-surec/${surecId}`);
  }

  getById(id: number): Observable<EtkinlikOrganizasyonSurecGorevResponse> {
    return this.http.get<EtkinlikOrganizasyonSurecGorevResponse>(`${this.apiUrl}/${id}`);
  }
}
