import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SurecAdimRequest } from '../../models/surec-adim-request';
import { SurecAdimResponse } from '../../models/surec-adim-response';
import { MaddeLogResponse } from '../../models/madde-log-response';

@Injectable({ providedIn: 'root' })
export class SurecAdimService {
  private readonly apiUrl = `${environment.apiUrl}/surec-adim`;

  constructor(private readonly http: HttpClient) {}

  create(request: SurecAdimRequest): Observable<SurecAdimResponse> {
    return this.http.post<SurecAdimResponse>(this.apiUrl, request);
  }

  update(id: number, request: SurecAdimRequest): Observable<SurecAdimResponse> {
    return this.http.put<SurecAdimResponse>(`${this.apiUrl}/${id}`, request);
  }

  getById(id: number): Observable<SurecAdimResponse> {
    return this.http.get<SurecAdimResponse>(`${this.apiUrl}/${id}`);
  }

  getByProsedurId(prosedurId: number): Observable<SurecAdimResponse[]> {
    return this.http.get<SurecAdimResponse[]>(`${this.apiUrl}/by-prosedur/${prosedurId}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  mulgaYap(id: number): Observable<SurecAdimResponse> {
    return this.http.put<SurecAdimResponse>(`${this.apiUrl}/${id}/mulga-yap`, {});
  }

  getLogsByProsedurId(prosedurId: number): Observable<MaddeLogResponse[]> {
    return this.http.get<MaddeLogResponse[]>(`${this.apiUrl}/log/prosedur/${prosedurId}`);
  }
}
