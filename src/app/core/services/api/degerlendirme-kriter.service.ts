import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DegerlendirmeKriterResponse, DegerlendirmeKriterRequest, KriterOzet } from '../../models/degerlendirme';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DegerlendirmeKriterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/degerlendirme-kriterler`;

  create(request: DegerlendirmeKriterRequest): Observable<DegerlendirmeKriterResponse> {
    return this.http.post<DegerlendirmeKriterResponse>(this.apiUrl, request);
  }

  getAllByDegerlendirmeId(degerlendirmeId: number): Observable<DegerlendirmeKriterResponse[]> {
    return this.http.get<DegerlendirmeKriterResponse[]>(`${this.apiUrl}/by-degerlendirme/${degerlendirmeId}`);
  }

  delete(id: number, degerlendirmeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?degerlendirmeId=${degerlendirmeId}`);
  }

  getAllKriterler(): Observable<KriterOzet[]> {
    return this.http.get<KriterOzet[]>(`${this.apiUrl}/kriterler`);
  }
}
