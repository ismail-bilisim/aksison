import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DersOzet } from 'src/app/core/models/ders-ozet';
import { VideoDersResponse } from '../../models/videoders-response';
import { VideoDersRequest } from '../../models/videoders-request';
import { VideodersSorumlular } from '../../models/videoders-sorumlular';
import { UcretBilgisiGirRequest } from '../../models/ucret-bilgisi-gir-request';

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

  // Onay işlemleri
  baslatmaOnayinaSun(id: number): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/baslatma-onaya-sun`, {});
  }

  baslatmaOnayla(id: number, onayNotu?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/baslatma-onayla`, onayNotu || null);
  }

  baslatmaReddet(id: number, redNedeni?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/baslatma-reddet`, redNedeni || null);
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

  // coklu kategoriye göre
  getByKategoriler(kategoriIds: number[]): Observable<DersOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }

  // GET by Kategori ID - for listing video lessons related to a single kategori
  getAllozetByKategori(kategoriId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategori/${kategoriId}`);
  }


  // GET by Ders ID - for listing video lessons related to a parent course
  getByDersId(dersId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  // GET by Proje ID - for listing video lessons related to a project
  getByProjeId(projeId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-proje/${projeId}`);
  }

  // GET by Paudas ID - for listing video lessons related to a paydas
  getByPaydasId(paydasId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-paydas/${paydasId}`);
  }

  // GET by Egitmen ID - for listing video lessons related to an egitmen
  getByEgitmenId(egitmenId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }

  // ==================== Workflow İşlemleri ====================

  // --- İçerik İşlemleri ---

  icerigiEgitmeneGonder(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/icerigi-egitmene-gonder`, not || null);
  }

  icerigiOnayaSun(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/icerigi-onaya-sun`, not || null);
  }

  icerikOnayla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/icerik-onayla`, not || null);
  }

  icerikReddet(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/icerik-reddet`, not || null);
  }

  // --- Örnek Video İşlemleri ---

  ornekVideoIste(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/ornek-video-iste`, not || null);
  }

  ornekVideoGonder(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/ornek-video-gonder`, not || null);
  }

  ornekVideoOnayla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/ornek-video-onayla`, not || null);
  }

  ornekVideoRevizeIste(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/ornek-video-revize-iste`, not || null);
  }

  ornekVideoReddet(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/ornek-video-reddet`, not || null);
  }

  // --- Ücret Bilgisi Girme ---

  ucretBilgisiGir(id: number, request: UcretBilgisiGirRequest): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/ucret-bilgisi-gir`, request);
  }

  // --- İzlence İşlemleri ---

  izlenceEgitmeneGonder(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/izlence-egitmene-gonder`, not || null);
  }

  izlenceOnayaSun(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/izlence-onaya-sun`, not || null);
  }

  izlenceOnayla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/izlence-onayla`, not || null);
  }

  izlenceyeRevizeIste(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/izlenceye-revize-iste`, not || null);
  }

  izlenceReddet(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/izlence-reddet`, not || null);
  }

  // --- Sözleşme İşlemleri ---

  sozlesmeTalepEt(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/sozlesme-talep-et`, not || null);
  }

  sozlesmeReddet(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/sozlesme-reddet`, not || null);
  }

  // --- Çekim İşlemleri ---

  cekimTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/cekim-tamamla`, not || null);
  }

  cekimOnOnayVer(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/cekim-on-onay`, not || null);
  }

  cekimRevizeIste(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/cekim-revize-iste`, not || null);
  }

  cekimReddet(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/cekim-reddet`, not || null);
  }

  // --- Detaylı Kontrol İşlemleri ---

  detayliKontrolOnayla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/detayli-kontrol-onayla`, not || null);
  }

  detayliRevizeIste(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/detayli-revize-iste`, not || null);
  }

  detayliRevizeyiTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/detayli-revizeyi-tamamla`, not || null);
  }

  // --- Soru Kontrol İşlemleri ---

  soruOnayla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/soru-onayla`, not || null);
  }

  soruRevizeIste(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/soru-revize-iste`, not || null);
  }

  soruRevizesiTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/soru-revizesi-tamamla`, not || null);
  }

  // --- Post-Prodüksiyon İşlemleri ---

  montajTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/montaj-tamamla`, not || null);
  }

  grafikTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/grafik-tamamla`, not || null);
  }

  tanitimVideosuTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/tanitim-videosu-tamamla`, not || null);
  }

  altYaziTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/alt-yazi-tamamla`, not || null);
  }

  storyboardTamamla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/storyboard-tamamla`, not || null);
  }

  // --- Yayın İşlemleri ---

  lmsYukle(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/lms-yukle`, not || null);
  }

  yayinOncesiOnayaSun(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/yayin-oncesi-onaya-sun`, not || null);
  }

  yayinlamaOnayla(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/yayinlama-onayla`, not || null);
  }

  yayinlamayiReddet(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/yayinlamayi-reddet`, not || null);
  }

  yayinaAl(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/yayina-al`, not || null);
  }

  sosyalMedyaDuyur(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/sosyal-medya-duyur`, not || null);
  }

  yayindanKaldir(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/yayindan-kaldir`, not || null);
  }

  iptalEt(id: number, not?: string): Observable<VideoDersResponse> {
    return this.http.put<VideoDersResponse>(`${this.apiUrl}/${id}/iptal-et`, not || null);
  }
  
}