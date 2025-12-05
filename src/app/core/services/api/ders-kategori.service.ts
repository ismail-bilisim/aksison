import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DersKategori } from '../../models/ders-kategori';

@Injectable({
  providedIn: 'root'
})
export class DersKategoriService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/derskategori`;

  getKategoriOzetByDersId(dersId: number): Observable<DersKategori[]> {
    return this.http.get<DersKategori[]>(`${this.apiUrl}/by-ders/ozet/${dersId}`);
  }

  addKategori(dersId: number, kategoriId: number): Observable<DersKategori> {
    const payload = { dersId, kategoriId };
    console.log('Adding ders kategori with payload:', payload);
    return this.http.post<DersKategori>(this.apiUrl, payload);
  }

  deleteKategori(dersId: number, kategoriId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?dersId=${dersId}&kategoriId=${kategoriId}`);
  }
}
