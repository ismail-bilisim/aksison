import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PrensipRequest } from '../../models/prensip-request';
import { PrensipResponse } from '../../models/prensip-response';
import { MaddeLogResponse } from '../../models/madde-log-response';

@Injectable({ providedIn: 'root' })
export class PrensipService {
  private readonly apiUrl = `${environment.apiUrl}/prensip`;

  constructor(private readonly http: HttpClient) {}

  create(request: PrensipRequest): Observable<PrensipResponse> {
    return this.http.post<PrensipResponse>(this.apiUrl, request);
  }

  update(id: number, request: PrensipRequest): Observable<PrensipResponse> {
    return this.http.put<PrensipResponse>(`${this.apiUrl}/${id}`, request);
  }

  getById(id: number): Observable<PrensipResponse> {
    return this.http.get<PrensipResponse>(`${this.apiUrl}/${id}`);
  }

  getByProsedurId(prosedurId: number): Observable<PrensipResponse[]> {
    return this.http.get<PrensipResponse[]>(`${this.apiUrl}/by-prosedur/${prosedurId}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  mulgaYap(id: number): Observable<PrensipResponse> {
    return this.http.put<PrensipResponse>(`${this.apiUrl}/${id}/mulga-yap`, {});
  }

  getLogsByProsedurId(prosedurId: number): Observable<MaddeLogResponse[]> {
    return this.http.get<MaddeLogResponse[]>(`${this.apiUrl}/log/prosedur/${prosedurId}`);
  }
}
