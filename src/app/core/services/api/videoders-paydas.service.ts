import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaydasOzet } from '../../models/paydas-ozet';

@Injectable({
  providedIn: 'root'
})
export class VideodersPaydasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/paydas-videoders`;

  getByDersId(dersId: number): Observable<PaydasOzet[]> {
    return this.http.get<PaydasOzet[]>(`${this.apiUrl}/by-ders/ozet/${dersId}`);
  }

  addPaydas(dersId: number, paydasId: number): Observable<any> {
    const payload = {
      dersId: dersId,
      paydasId: paydasId
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  deletePaydas(dersId: number, paydasId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?dersId=${dersId}&paydasId=${paydasId}`);
  }
}
