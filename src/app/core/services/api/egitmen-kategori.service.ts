import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EgitmenKategoriRequest, EgitmenKategoriResponse } from '../../models/egitmen-kategori';
import { KategoriOzet } from '../../models/kategori-ozet';

@Injectable({ providedIn: 'root' })
export class EgitmenKategoriService {
  private apiUrl = `${environment.apiUrl}/egitmenkategori`;

  constructor(private http: HttpClient) { }

  create(request: EgitmenKategoriRequest): Observable<EgitmenKategoriResponse> {
    return this.http.post<EgitmenKategoriResponse>(this.apiUrl, request);
  }

  getAllByEgitmenId(egitmenId: number): Observable<EgitmenKategoriResponse[]> {
    return this.http.get<EgitmenKategoriResponse[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }

  getAllKategoriOzetByEgitmenId(egitmenId: number): Observable<KategoriOzet[]> {
    return this.http.get<KategoriOzet[]>(`${this.apiUrl}/by-egitmen/ozet/${egitmenId}`);
  }

  delete(egitmenId: number, kategoriId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?egitmenId=${egitmenId}&kategoriId=${kategoriId}`);
  }
}
