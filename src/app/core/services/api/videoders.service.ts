import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { VideoDersResponse } from '../../models/videoders-response';
import { VideoDersRequest } from '../../models/videoders-request';
import { VideodersSorumlular } from '../../models/videoders-sorumlular';

@Injectable({ providedIn: 'root' })
export class VideodersService {
  private apiUrl = `${environment.apiUrl}/videoders`;

  constructor(private http: HttpClient) { }

  // GET All  Ozet
  getAllOzet(): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/all-ozet`);
  }

    // POST - Create
  create(videoDers: VideoDersRequest): Observable<VideoDersResponse> {
    return this.http.post<VideoDersResponse>(this.apiUrl, videoDers);
  }

  // PUT - Update
  update(id: number, videoDers: VideoDersRequest): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}`, videoDers);
  }

  // DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<VideoDersResponse> {
    return this.http.get<VideoDersResponse>(`${this.apiUrl}/${id}`);
  }

  // GET by Kodu
  getByKodu(kod: number): Observable<VideoDersResponse> {
    return this.http.get<VideoDersResponse>(`${this.apiUrl}/by-kod/${kod}`);
  }

  // GET by Adi
  getAllByAdi(adi: string): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-adi/${adi}`);
  }

  // GET by Durum
  getAllByDurum(durumKodu: string): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-durum/${durumKodu}`);
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

  // GET Sorumlular by ID
  getSorumlular(id: number): Observable<VideodersSorumlular> {
    return this.http.get<VideodersSorumlular>(`${this.apiUrl}/${id}/sorumlular`);
  }


  // Backward compatibility methods
  getByDurum(durum: string): Observable<DersOzet[]> {
    return this.getAllByDurum(durum);
  }

  getByProjeYoneticisi(kullaniciId: number): Observable<DersOzet[]> {
    return this.getAllByProjeYoneticisi(kullaniciId);
  }

  getByMateryalGelistirici(kullaniciId: number): Observable<DersOzet[]> {
    return this.getAllByMateryalGelistirici(kullaniciId);
  }

  getByKategoriler(kategoriIds: number[]): Observable<DersOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }
}


