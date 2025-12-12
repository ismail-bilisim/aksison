import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HedefKitleEgitimSeviyesiResponse } from '../../models/hedef-kitle-egitim-seviyesi-response';

@Injectable({
  providedIn: 'root'
})
export class HedefKitleEgitimSeviyesiService {
  private baseUrl = `${environment.apiUrl}/hedef-kitle-egitim-seviyeleri`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<HedefKitleEgitimSeviyesiResponse[]> {
    return this.http.get<HedefKitleEgitimSeviyesiResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<HedefKitleEgitimSeviyesiResponse> {
    return this.http.get<HedefKitleEgitimSeviyesiResponse>(`${this.baseUrl}/${id}`);
  }

  getByKodu(kodu: string): Observable<HedefKitleEgitimSeviyesiResponse> {
    return this.http.get<HedefKitleEgitimSeviyesiResponse>(`${this.baseUrl}/kodu/${kodu}`);
  }
}
