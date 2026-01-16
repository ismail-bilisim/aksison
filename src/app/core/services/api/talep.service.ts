import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TalepRequest } from '../../models/talep-request';
import { TalepResponse } from '../../models/talep-response';
import { TalepOzet } from '../../models/talep-ozet';
import { TalepStatistics } from '../../models/talep-statistics';
import { KullaniciOzet } from '../../models/kullanici-ozet';
import { TalepOzetDurum } from '../../models/talep-ozet-durum';
import { IslemKayit } from 'src/app/core/models/islem-kayit';

@Injectable({
  providedIn: 'root'
})
export class TalepService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/talep`;

  constructor() {

   }

  create(request: TalepRequest): Observable<TalepResponse> {
    return this.http.post<TalepResponse>(this.apiUrl, request);
  }

  update(id: number, request: TalepRequest): Observable<TalepResponse> {
    return this.http.put<TalepResponse>(`${this.apiUrl}/${id}`, request);
  }

  iptalEt(id: number, iptalAciklama?: string): Observable<void> {
    let params = new HttpParams();
    if (iptalAciklama) {
      params = params.set('aciklama', iptalAciklama);
    }
    return this.http.put<void>(`${this.apiUrl}/${id}/iptal-et`, {}, { params });
  }


  talepSonuclandir(id: number, sonucAciklama?: string): Observable<void> {
    let params = new HttpParams();
    if (sonucAciklama) {
      params = params.set('aciklama', sonucAciklama);
    }
    return this.http.put<void>(`${this.apiUrl}/${id}/sonuclandir`, {}, { params });
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  getById(id: number): Observable<TalepResponse> {
    return this.http.get<TalepResponse>(`${this.apiUrl}/${id}`);
  }

  getAllOzet(startDate?: string, endDate?: string): Observable<TalepOzet[]> {
    let params = new HttpParams();
    if (startDate && endDate) {
      params = params.set('startDate', startDate).set('endDate', endDate);
    }
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/ozet`, { params });
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

  
  //TODO
  // getMyTalepler(startDate: string, endDate: string): Observable<TalepOzet[]> {
  //   let params = new HttpParams()
  //     .set('startDate', startDate)
  //     .set('endDate', endDate);
  //   return this.http.get<TalepOzet[]>(`${this.apiUrl}/bana-atanan`, { params });
  // }

  getAllTalepBanaAtanan(): Observable<TalepOzet[]> {
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/bana-atanan`, { });
  }


  getTaleplerByDurumu(durumKodu: string, startDate: string, endDate: string): Observable<TalepOzet[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TalepOzet[]>(`${this.apiUrl}/by-durum/${durumKodu}`, { params });
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

  getByTalepId(talepId: number): Observable<IslemKayit[]> {
    return this.http.get<IslemKayit[]>(`${this.apiUrl}/${talepId}/islemkayit`);
  }




}