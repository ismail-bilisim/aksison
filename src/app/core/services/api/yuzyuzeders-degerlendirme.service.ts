import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DersDegerlendirmeResponse, DersDegerlendirmeRequest, DegerlendirmeTuruOzet } from '../../models/degerlendirme';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YuzyuzeDersDegerlendirmeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/yuzyuzeders-degerlendirmeler`;

  create(request: DersDegerlendirmeRequest): Observable<DersDegerlendirmeResponse> {
    return this.http.post<DersDegerlendirmeResponse>(this.apiUrl, request);
  }

  getAllByDersId(dersId: number): Observable<DersDegerlendirmeResponse[]> {
    return this.http.get<DersDegerlendirmeResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  delete(id: number, dersId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?dersId=${dersId}`);
  }

  getAllTurler(): Observable<DegerlendirmeTuruOzet[]> {
    return this.http.get<DegerlendirmeTuruOzet[]>(`${this.apiUrl}/turler`);
  }
}
