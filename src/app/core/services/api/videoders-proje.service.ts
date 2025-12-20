import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProjeOzet } from '../../models/proje-ozet';

@Injectable({
  providedIn: 'root'
})
export class VideodersProjeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projevideoders`;

  getByDersId(dersId: number): Observable<ProjeOzet[]> {
    return this.http.get<ProjeOzet[]>(`${this.apiUrl}/by-ders/ozet/${dersId}`);
  }

  addProje(dersId: number, projeId: number): Observable<any> {
    const payload = {
      dersId: dersId,
      projeId: projeId
    };
    return this.http.post<any>(this.apiUrl, payload);
  }

  deleteProje(dersId: number, projeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?dersId=${dersId}&projeId=${projeId}`);
  }
}
