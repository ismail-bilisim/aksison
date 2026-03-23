import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CanliDersBasvuruResponse } from '../../models/canliders-basvuru-response';
import { CanliDersBasvuruRequest } from '../../models/canliders-basvuru-request';

@Injectable({ providedIn: 'root' })
export class CanliDersBasvuruService {
  private apiUrl = `${environment.apiUrl}/canliders-basvuru`;

  constructor(private http: HttpClient) {}

  create(request: CanliDersBasvuruRequest): Observable<CanliDersBasvuruResponse> {
    return this.http.post<CanliDersBasvuruResponse>(this.apiUrl, request);
  }

  getAllByDersId(dersId: number): Observable<CanliDersBasvuruResponse[]> {
    return this.http.get<CanliDersBasvuruResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }
}
