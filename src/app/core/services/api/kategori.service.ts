import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Kategori } from '../../models/kategori';
import { KategoriOzet } from '../../models/kategori-ozet';

@Injectable({
  providedIn: 'root'
})
export class KategoriService {
  private apiUrl = `${environment.apiUrl}/kategori`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Kategori[]> {
    return this.http.get<Kategori[]>(this.apiUrl);
  }

  getAllOzet(): Observable<KategoriOzet[]> {
    return this.http.get<KategoriOzet[]>(`${this.apiUrl}/ozet`);
  }

  getById(id: number): Observable<Kategori> {
    return this.http.get<Kategori>(`${this.apiUrl}/${id}`);
  }

  getAltKategoriler(id: number): Observable<Kategori[]> {
    return this.http.get<Kategori[]>(`${this.apiUrl}/${id}/alt-kategoriler`);
  }

  create(kategori: Partial<Kategori>): Observable<Kategori> {
    return this.http.post<Kategori>(this.apiUrl, kategori);
  }

  update(id: number, kategori: Partial<Kategori>): Observable<Kategori> {
    return this.http.put<Kategori>(`${this.apiUrl}/${id}`, kategori);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Kategori[]> {
    return this.http.get<Kategori[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}
