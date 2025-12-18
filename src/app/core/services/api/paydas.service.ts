import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaydasOzet } from '../../models/paydas-ozet';
import { PaydasResponse } from '../../models/paydas-response';

@Injectable({
  providedIn: 'root'
})
export class PaydasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/paydas`;

  getAll(): Observable<PaydasOzet[]> {
    return this.http.get<PaydasOzet[]>(`${this.apiUrl}/ozet`);
  }

  getById(id: number): Observable<PaydasResponse> {
    return this.http.get<PaydasResponse>(`${this.apiUrl}/${id}`);
  }
}
