import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VideoDers } from 'src/app/core/models/videoders-detay';
import { DersOzet } from 'src/app/core/models/ders-ozet';

@Injectable({ providedIn: 'root' })
export class VideodersService {
  private apiUrl = `${environment.apiUrl}/videoders`;

  constructor(private http: HttpClient) { }

  // GET All
  getAll(): Observable<VideoDers[]> {
    return this.http.get<VideoDers[]>(this.apiUrl);
  }

  // GET by Kodu
  getByKodu(kodu: number): Observable<VideoDers> {
    return this.http.get<VideoDers>(`${this.apiUrl}/${kodu}`);
  }

  // GET by Adi
  getAllByAdi(adi: string): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-adi/${adi}`);
  }

  // GET by Durum
  getAllByDurum(durumKodu: string): Observable<VideoDers[]> {
    return this.http.get<VideoDers[]>(`${this.apiUrl}/by-durum/${durumKodu}`);
  }

  // GET by Onay Durumu
  getAllByOnayDurumu(onayDurumu: string): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-onay-durumu/${onayDurumu}`);
  }

  // GET by Turu
  getAllByTuru(turuKodu: string): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-turu/${turuKodu}`);
  }

  // GET by Odeme Kaynak
  getAllByOdemeKaynak(odemeKaynak: string): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-odeme-kaynak/${odemeKaynak}`);
  }

  // GET by İcerik Yoneticisi
  getAllByIcerikYoneticisi(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-icerik-yoneticisi/${kullaniciId}`);
  }

  // GET by Proje Yoneticisi
  getAllByProjeYoneticisi(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-proje-yoneticisi/${kullaniciId}`);
  }

  // GET by Materyal Gelistirici
  getAllByMateryalGelistirici(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-materyal-gelistirici/${kullaniciId}`);
  }

  // GET by Kontrol Eden
  getAllByKontrolEden(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kontrol-eden/${kullaniciId}`);
  }

  // GET by Grafik Duzenleyici
  getAllByGrafikDuzenleyici(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-grafik-duzenleyici/${kullaniciId}`);
  }

  // GET by Video Duzenleyici
  getAllByVideoDuzenleyici(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-video-duzenleyici/${kullaniciId}`);
  }

  // GET by LMS Sorumlu
  getAllByLmsSorumlu(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-lms-sorumlu/${kullaniciId}`);
  }

  // GET by Medya Sorumlu
  getAllByMedyaSorumlu(kullaniciId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-medya-sorumlu/${kullaniciId}`);
  }

  // GET by Paydas
  getAllByPaydas(paydasId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-paydas/${paydasId}`);
  }

  // POST - Create
  create(videoDers: VideoDers): Observable<VideoDers> {
    return this.http.post<VideoDers>(this.apiUrl, videoDers);
  }

  // PUT - Update
  update(kodu: number, videoDers: VideoDers): Observable<VideoDers> {
    return this.http.put<VideoDers>(`${this.apiUrl}/${kodu}`, videoDers);
  }

  // DELETE
  delete(kodu: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${kodu}`);
  }

  // Backward compatibility methods
  getByDurum(durum: string): Observable<VideoDers[]> {
    return this.getAllByDurum(durum);
  }

  getByProjeYoneticisi(kullaniciId: number): Observable<DersOzet[]> {
    return this.getAllByProjeYoneticisi(kullaniciId);
  }

  getByMateryalGelistirici(kullaniciId: number): Observable<DersOzet[]> {
    return this.getAllByMateryalGelistirici(kullaniciId);
  }
}

