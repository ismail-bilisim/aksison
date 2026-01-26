import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjeOzet } from '../../models/proje-ozet';

@Injectable({ providedIn: 'root' })
export class YuzyuzedersProjeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/proje-yuzyuzeders`;

  getByDersId(dersId: number): Observable<ProjeOzet[]> {
    return this.http.get<ProjeOzet[]>(`${this.apiUrl}/by-ders/ozet/${dersId}`);
  }

  addProje(dersId: number, projeId: number): Observable<void> {
    return this.http.post<void>(this.apiUrl, { dersId, projeId });
  }

  deleteProje(dersId: number, projeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?dersId=${dersId}&projeId=${projeId}`);
  }
}
