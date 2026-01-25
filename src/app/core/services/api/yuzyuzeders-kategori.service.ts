import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { KategoriOzet } from '../../models/kategori-ozet';

@Injectable({ providedIn: 'root' })
export class YuzyuzedersKategoriService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/yuzyuzederskategori`;

  getKategoriOzetByDersId(dersId: number): Observable<KategoriOzet[]> {
    return this.http.get<KategoriOzet[]>(`${this.apiUrl}/by-ders/ozet/${dersId}`);
  }

  addKategori(dersId: number, kategoriId: number): Observable<KategoriOzet> {
    const payload = { dersId, kategoriId };
    return this.http.post<KategoriOzet>(this.apiUrl, payload);
  }

  deleteKategori(dersId: number, kategoriId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?dersId=${dersId}&kategoriId=${kategoriId}`);
  }
}
