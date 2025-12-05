import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DersTuru } from '../../models/ders-turu';

@Injectable({
  providedIn: 'root'
})
export class DersTuruService {
  private baseUrl = `${environment.apiUrl}/dersturu`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DersTuru[]> {
    return this.http.get<DersTuru[]>(this.baseUrl);
  }
}
