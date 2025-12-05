import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DersSeviyesi } from 'src/app/core/models/ders-seviyesi';

@Injectable({
  providedIn: 'root'
})
export class DersSeviyesiService {
  private baseUrl = `${environment.apiUrl}/dersseviyesi`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DersSeviyesi[]> {
    return this.http.get<DersSeviyesi[]>(this.baseUrl);
  }
}
