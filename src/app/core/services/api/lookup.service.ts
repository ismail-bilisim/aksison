import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TalepKonusuOzet } from '../../models/talep-konusu';
import { KategoriOzet } from '../../models/kategori-ozet';
import { SehirOzet } from '../../models/sehir-ozet';
import { DersTuru } from '../../models/ders-turu';
import { DersSeviyesi } from '../../models/ders-seviyesi';
import { DersNiteligi } from '../../models/ders-niteligi';
import { DersOzet } from '../../models/ders-ozet';
import { HedefKitleEgitimSeviyesiResponse } from '../../models/hedef-kitle-egitim-seviyesi-response';
import { DersCekimYontemiResponse } from '../../models/ders-cekim-yontemi-response';
import { OdemeKaynak } from '../../models/odemekaynak';
import { VideodersLookupData } from '../../models/videoders-lookup-data';
import { YuzyuzedersLookupData } from '../../models/yuzyuzeders-lookup-data';
import { CanlidersLookupData } from '../../models/canliders-lookup-data';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private http = inject(HttpClient);

  // API URLs
  private apiUrls = {
    talepKonusu: `${environment.apiUrl}/talepkonusu`,
    kategori: `${environment.apiUrl}/kategori`,
    sehir: `${environment.apiUrl}/sehir`,
    dersTuru: `${environment.apiUrl}/dersturu`,
    dersSeviyesi: `${environment.apiUrl}/dersseviyesi`,
    dersNiteligi: `${environment.apiUrl}/dersniteligi`,
    hedefKitleEgitimSeviyesi: `${environment.apiUrl}/hedefkitle-egitimseviyesi`,
    dersCekimYontemi: `${environment.apiUrl}/ders-cekimyontemi`,
    odemeKaynak: `${environment.apiUrl}/odemekaynak`,
    ders: `${environment.apiUrl}/ders`
  };

  // endpoint bazlı cache
  private cache = new Map<string, Observable<any>>();

  private cachedGet<T>(url: string): Observable<T> {
    const hit = this.cache.get(url) as Observable<T> | undefined;
    if (hit) return hit;

    const req$ = this.http.get<T>(url).pipe(
      // 1 kez çek, sonucu paylaş + hafızada tut
      shareReplay({ bufferSize: 1, refCount: false }),

      // hata olursa cache'i temizle ki sonraki deneme tekrar atsın
      catchError(err => {
        this.cache.delete(url);
        return throwError(() => err);
      })
    );

    this.cache.set(url, req$);
    return req$;
  }

  // ========== Genel Lookup Metodları ==========

  getAllKategoriOzet(): Observable<KategoriOzet[]> {
    return this.cachedGet<KategoriOzet[]>(`${this.apiUrls.kategori}/ozet`);
  }

  getAllTalepKonusuOzet(): Observable<TalepKonusuOzet[]> {
    return this.cachedGet<TalepKonusuOzet[]>(`${this.apiUrls.talepKonusu}/ozet`);
  }

  getAllSehirOzet(): Observable<SehirOzet[]> {
    return this.cachedGet<SehirOzet[]>(`${this.apiUrls.sehir}/ozet`);
  }

  // ========== Ders Ortak Lookup Metodları ==========

  getDersTurleri(): Observable<DersTuru[]> {
    return this.cachedGet<DersTuru[]>(this.apiUrls.dersTuru);
  }

  getDersSeviyeleri(): Observable<DersSeviyesi[]> {
    return this.cachedGet<DersSeviyesi[]>(this.apiUrls.dersSeviyesi);
  }

  getDersNitelikleri(): Observable<DersNiteligi[]> {
    return this.cachedGet<DersNiteligi[]>(this.apiUrls.dersNiteligi);
  }

  getHedefKitleEgitimSeviyeleri(): Observable<HedefKitleEgitimSeviyesiResponse[]> {
    return this.cachedGet<HedefKitleEgitimSeviyesiResponse[]>(this.apiUrls.hedefKitleEgitimSeviyesi);
  }

  getDersCekimYontemleri(): Observable<DersCekimYontemiResponse[]> {
    return this.cachedGet<DersCekimYontemiResponse[]>(this.apiUrls.dersCekimYontemi);
  }

  getOdemeKaynaklari(): Observable<OdemeKaynak[]> {
    return this.cachedGet<OdemeKaynak[]>(this.apiUrls.odemeKaynak);
  }

  getDersler(): Observable<DersOzet[]> {
    return this.cachedGet<DersOzet[]>(`${this.apiUrls.ders}/onayli-ozet`);
  }

  // ========== Videoders Aggregate Lookup ==========

  /**
   * Tüm videoders lookup verilerini paralel olarak yükler
   */
  getVideodersLookups(): Observable<VideodersLookupData> {
    return forkJoin({
      dersTurleri: this.getDersTurleri(),
      dersSeviyeleri: this.getDersSeviyeleri(),
      dersNitelikleri: this.getDersNitelikleri(),
      hedefKitleEgitimSeviyeleri: this.getHedefKitleEgitimSeviyeleri(),
      dersCekimYontemleri: this.getDersCekimYontemleri(),
      odemeKaynaklari: this.getOdemeKaynaklari(),
      dersler: this.getDersler()
    });
  }

  // ========== Yuzyuzeders Aggregate Lookup ==========

  /**
   * Tüm yüzyüze ders lookup verilerini paralel olarak yükler
   */
  getYuzyuzedersLookups(): Observable<YuzyuzedersLookupData> {
    return forkJoin({
      dersTurleri: this.getDersTurleri(),
      dersSeviyeleri: this.getDersSeviyeleri(),
      dersNitelikleri: this.getDersNitelikleri(),
      hedefKitleEgitimSeviyeleri: this.getHedefKitleEgitimSeviyeleri(),
      odemeKaynaklari: this.getOdemeKaynaklari(),
      sehirler: this.getAllSehirOzet(),
      dersler: this.getDersler()
    });
  }

  // ========== Canliders Aggregate Lookup ==========

  getCanlidersLookups(): Observable<CanlidersLookupData> {
    return forkJoin({
      dersTurleri: this.getDersTurleri(),
      dersSeviyeleri: this.getDersSeviyeleri(),
      dersNitelikleri: this.getDersNitelikleri(),
      hedefKitleEgitimSeviyeleri: this.getHedefKitleEgitimSeviyeleri(),
      odemeKaynaklari: this.getOdemeKaynaklari(),
      dersler: this.getDersler()
    });
  }

  // ========== Cache Yönetimi ==========

  /**
   * Manuel cache temizleme (ihtiyaç halinde)
   */
  clearCache(url?: string): void {
    if (!url) {
      this.cache.clear();
    } else {
      this.cache.delete(url);
    }
  }

  /**
   * @deprecated Use clearCache() instead
   */
  refresh(url?: string): void {
    this.clearCache(url);
  }

}
