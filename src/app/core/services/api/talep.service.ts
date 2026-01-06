import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TalepRequest } from '../../models/talep-request';
import { TalepResponse } from '../../models/talep-response';
import { TalepOzet } from '../../models/talep-ozet';
import { TalepStatistics } from '../../models/talep-statistics';
import { KullaniciOzet } from '../../models/kullanici-ozet';
import { TalepOzetDurum } from '../../models/talep-ozet-durum';

@Injectable({
  providedIn: 'root'
})
export class TalepService {
  private apiUrl = `${environment.apiUrl}/talep`;

  constructor(private http: HttpClient) { }

  create(request: TalepRequest): Observable<TalepResponse> {
    return this.http.post<TalepResponse>(this.apiUrl, request);
  }

  update(id: number, request: TalepRequest): Observable<TalepResponse> {
    return this.http.put<TalepResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<TalepResponse> {
    return this.http.get<TalepResponse>(`${this.apiUrl}/${id}`);
  }

  getAllOzet(): Observable<TalepOzet[]> {
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/ozet`);
  }

  getAllOzetWithDurum(): Observable<TalepOzetDurum[]> {
    return this.http.get<TalepOzetDurum[]>(`${this.apiUrl}/ozet-durum`);
  }


  /**
   * Onay durumuna göre talepleri listele
   * @param onayDurumu Onay durumu kodu (tas, ons, ony, red)
   */
  getByOnayDurumu(onayDurumu: string): Observable<TalepOzet[]> {
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/by-onay/${onayDurumu}`);
  }

  getStatistics(startDate: string, endDate: string): Observable<TalepStatistics> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepStatistics>(`${this.apiUrl}/statistics`, { params });
  }

  getTaleplerByAtananKisi(kullaniciId: number, startDate: string, endDate: string): Observable<TalepOzet[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/atanan/${kullaniciId}`, { params });
  }

  getMyTalepler(startDate: string, endDate: string): Observable<TalepOzet[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/bana-atanan`, { params });
  }

  getTaleplerByDurumu(durumKodu: string, startDate: string, endDate: string): Observable<TalepOzet[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/by-durumu/${durumKodu}`, { params });
  }

  /**
   * Talebi başka birine ata (TAKLI veya ADMIN için)
   */
  assignTalep(id: number, kullaniciId: number): Observable<TalepResponse> {
    let params = new HttpParams()
      .set('atananKullaniciId', kullaniciId.toString());
    return this.http.post<TalepResponse>(`${this.apiUrl}/${id}/assign`, {}, { params });
  }

  /**
   * Talebi kendine ata (PRJYN için)
   */
  assignToSelf(id: number): Observable<TalepResponse> {
    return this.http.post<TalepResponse>(`${this.apiUrl}/${id}/assign-self`, {});
  }

  /**
   * Atama yapılabilecek kullanıcıları listele (PRJYN, METGL, ICYON)
   */
  getAssignableUsers(): Observable<KullaniciOzet[]> {
    return this.http.get<KullaniciOzet[]>(`${this.apiUrl}/assignable-users`);
  }

  icerikOnayinaSun(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-onaya-sun`, {});
  }

  icerikOnayla(id: number, aciklama?: string): Observable<void> {
    let params = new HttpParams();
    if (aciklama) {
      params = params.set('aciklama', aciklama);
    }
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-onayla`, {}, { params });
  }

  icerikReddet(id: number, redSebebi?: string): Observable<void> {
    let params = new HttpParams();
    if (redSebebi) {
      params = params.set('redSebebi', redSebebi);
    }
    return this.http.put<void>(`${this.apiUrl}/${id}/icerik-reddet`, {}, { params });
  }
}