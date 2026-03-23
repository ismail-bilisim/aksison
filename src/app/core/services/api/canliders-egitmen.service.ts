import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EgitmenOzet } from '../../models/egitmen-ozet';

@Injectable({ providedIn: 'root' })
export class CanlidersEgitmenService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/canliders-egitmen`;

  getByDersId(dersId: number): Observable<EgitmenOzet[]> {
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  addEgitmen(dersId: number, egitmenId: number): Observable<void> {
    return this.http.post<void>(this.apiUrl, { dersId, egitmenId });
  }

  deleteEgitmen(dersId: number, egitmenId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?dersId=${dersId}&egitmenId=${egitmenId}`);
  }
}
