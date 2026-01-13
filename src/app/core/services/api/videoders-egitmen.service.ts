import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EgitmenOzet } from 'src/app/core/models/egitmen-ozet';

@Injectable({
  providedIn: 'root'
})
export class VideodersEgitmenService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/videoders-egitmen`;

  getByDersId(dersId: number): Observable<EgitmenOzet[]> {
    return this.http.get<EgitmenOzet[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }
}
