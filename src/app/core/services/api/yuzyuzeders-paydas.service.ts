import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaydasOzet } from '../../models/paydas-ozet';

@Injectable({ providedIn: 'root' })
export class YuzyuzedersPaydasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/paydas-yuzyuzeders`;

  getByDersId(dersId: number): Observable<PaydasOzet[]> {
    return this.http.get<PaydasOzet[]>(`${this.apiUrl}/by-ders/ozet/${dersId}`);
  }

  addPaydas(dersId: number, paydasId: number): Observable<PaydasOzet> {
    const payload = { dersId, paydasId };
    return this.http.post<PaydasOzet>(this.apiUrl, payload);
  }

  deletePaydas(dersId: number, paydasId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?dersId=${dersId}&paydasId=${paydasId}`);
  }
}
