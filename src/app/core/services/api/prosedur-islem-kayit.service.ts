import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProsedurIslemKayitResponse } from '../../models/prosedur-islem-kayit-response';

@Injectable({ providedIn: 'root' })
export class ProsedurIslemKayitService {
  private readonly apiUrl = `${environment.apiUrl}/prosedur-islemkayit`;

  constructor(private readonly http: HttpClient) {}

  getByProsedurId(prosedurId: number): Observable<ProsedurIslemKayitResponse[]> {
    return this.http.get<ProsedurIslemKayitResponse[]>(`${this.apiUrl}/by-prosedur/${prosedurId}`);
  }
}
