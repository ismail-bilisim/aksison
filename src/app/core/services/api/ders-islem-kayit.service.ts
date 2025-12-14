import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DersIslemKayit } from '../../models/ders-islem-kayit';

@Injectable({ providedIn: 'root' })
export class DersIslemKayitService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ders-islemkayit`;

  getByDersId(dersId: number): Observable<DersIslemKayit[]> {
    return this.http.get<DersIslemKayit[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }
}
