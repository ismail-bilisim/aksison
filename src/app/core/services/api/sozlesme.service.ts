import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SozlesmeResponse } from '../../models/sozlesme-ders-response';

@Injectable({ providedIn: 'root' })
export class SozlesmeService {
  private apiUrl = `${environment.apiUrl}/sozlesme`;

  constructor(private http: HttpClient) { }

  getAllByEgitmenId(egitmenId: number): Observable<SozlesmeResponse[]> {
    return this.http.get<SozlesmeResponse[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }
}
