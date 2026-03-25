import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EtkinlikOrganizasyonMateryalResponse } from '../../models/etkinlik-organizasyon-materyal-response';
import { MedyaTuruOzet } from '../../models/medya-turu-ozet';

@Injectable({ providedIn: 'root' })
export class EtkinlikOrganizasyonMateryalService {
  private readonly apiUrl = `${environment.apiUrl}/etkinlikorganizasyon-materyal`;

  constructor(private readonly http: HttpClient) {}

  upload(etkinlikOrganizasyonId: number, medyaTuruId: number, file: File): Observable<EtkinlikOrganizasyonMateryalResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('etkinlikOrganizasyonId', etkinlikOrganizasyonId.toString());
    formData.append('medyaTuruId', medyaTuruId.toString());
    return this.http.post<EtkinlikOrganizasyonMateryalResponse>(`${this.apiUrl}/upload`, formData);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }

  getByEtkinlikOrganizasyonId(etkinlikOrganizasyonId: number): Observable<EtkinlikOrganizasyonMateryalResponse[]> {
    return this.http.get<EtkinlikOrganizasyonMateryalResponse[]>(`${this.apiUrl}/ders/${etkinlikOrganizasyonId}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMedyaTurleri(): Observable<MedyaTuruOzet[]> {
    return this.http.get<MedyaTuruOzet[]>(`${this.apiUrl}/medya-turleri`);
  }
}
