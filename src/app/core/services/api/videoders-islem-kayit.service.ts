import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VideoDersIslemKayit } from '../../models/videoders-islem-kayit';

@Injectable({ providedIn: 'root' })
export class VideoDersIslemKayitService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/videoders-islemkayit`;

  getByDersId(dersId: number): Observable<VideoDersIslemKayit[]> {
    return this.http.get<VideoDersIslemKayit[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }
}
