import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { YuzyuzeDersBasvuruResponse } from '../../models/yuzyuzeders-basvuru-response';
import { YuzyuzeDersBasvuruRequest } from '../../models/yuzyuzeders-basvuru-request';

@Injectable({ providedIn: 'root' })
export class YuzyuzeDersBasvuruService {
  private apiUrl = `${environment.apiUrl}/yuzyuzeders-basvuru`;

  constructor(private http: HttpClient) {}

  create(request: YuzyuzeDersBasvuruRequest): Observable<YuzyuzeDersBasvuruResponse> {
    return this.http.post<YuzyuzeDersBasvuruResponse>(this.apiUrl, request);
  }

  getAllByDersId(dersId: number): Observable<YuzyuzeDersBasvuruResponse[]> {
    return this.http.get<YuzyuzeDersBasvuruResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }
}
