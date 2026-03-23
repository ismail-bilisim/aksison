import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IslemKayit } from '../../models/islem-kayit';

@Injectable({ providedIn: 'root' })
export class CanlidersIslemKayitService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/canliders-islemkayit`;

  getByDersId(dersId: number): Observable<IslemKayit[]> {
    return this.http.get<IslemKayit[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }
}
