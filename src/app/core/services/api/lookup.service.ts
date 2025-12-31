import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TalepKonusuOzet } from '../../models/talep-konusu';
import { KategoriOzet } from '../../models/kategori-ozet';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private apiUrlTalepKonusu = `${environment.apiUrl}/talepkonusu`;
  private apiUrlKategori = `${environment.apiUrl}/kategori`;
  
  constructor() { }

  private http = inject(HttpClient);

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

  // örnek lookup methodları
  getAllKategoriOzet() {
    return this.cachedGet<KategoriOzet[]>(this.apiUrlKategori + '/ozet');
  }

  getAllTalepKonusuOzet() {
    return this.cachedGet<TalepKonusuOzet[]>(this.apiUrlTalepKonusu + '/ozet');
  }

  // manuel yenileme istersen
  refresh(url?: string) {
    if (!url) this.cache.clear();
    else this.cache.delete(url);
  }

}
