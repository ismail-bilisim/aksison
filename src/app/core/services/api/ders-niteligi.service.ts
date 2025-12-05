import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DersNiteligi } from 'src/app/core/models/ders-niteligi';

@Injectable({
  providedIn: 'root'
})
export class DersNiteligiService {
  private baseUrl = `${environment.apiUrl}/dersniteligi`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DersNiteligi[]> {
    return this.http.get<DersNiteligi[]>(this.baseUrl);
  }
}
