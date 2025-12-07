import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ders } from 'src/app/core/models/ders';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Injectable({ providedIn: 'root' })
export class DersService {
  private apiUrl = `${environment.apiUrl}/ders`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Ders[]> {
    return this.http.get<Ders[]>(this.apiUrl);
  }

  getAllOzet(): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/all-ozet`);
  }

  getById(id: number): Observable<Ders> {
    return this.http.get<Ders>(`${this.apiUrl}/${id}`);
  }

  getByKodu(kodu: number): Observable<Ders> {
    return this.http.get<Ders>(`${this.apiUrl}/by-kodu/${kodu}`);
  }

  getByAdi(adi: string): Observable<Ders> {
    return this.http.get<Ders>(`${this.apiUrl}/by-adi/${adi}`);
  }

  getByOnayDurumu(onayDurumu: string): Observable<Ders[]> {
    return this.http.get<Ders[]>(`${this.apiUrl}/by-onay-durumu/${onayDurumu}`);
  }

  getByIcerikYoneticisi(kullaniciId: number): Observable<Ders[]> {
    return this.http.get<Ders[]>(`${this.apiUrl}/by-icerik-yoneticisi/${kullaniciId}`);
  }

  create(ders: Ders): Observable<Ders> {
    return this.http.post<Ders>(this.apiUrl, ders);
  }

  update(id: number, ders: Ders): Observable<Ders> {
    return this.http.put<Ders>(`${this.apiUrl}/${id}`, ders);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
