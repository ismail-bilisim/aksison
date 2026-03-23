import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { YuzyuzeDersRequest } from '../../models/yuzyuzeders-request';
import { YuzyuzeDersResponse } from '../../models/yuzyuzeders-response';
import { DersOzet } from '../../models/ders-ozet';
import { UcretBilgisiGirRequest } from '../../models/ucret-bilgisi-gir-request';

@Injectable({
  providedIn: 'root'
})
export class YuzyuzedersService {
  private readonly apiUrl = `${environment.apiUrl}/yuzyuzeders`;

  constructor(private readonly http: HttpClient) { }

  getById(id: number): Observable<YuzyuzeDersResponse> {
    return this.http.get<YuzyuzeDersResponse>(`${this.apiUrl}/${id}`);
  }

  getByKodu(kodu: number): Observable<YuzyuzeDersResponse> {
    return this.http.get<YuzyuzeDersResponse>(`${this.apiUrl}/by-kod/${kodu}`);
  }

  create(request: YuzyuzeDersRequest): Observable<YuzyuzeDersResponse> {
    return this.http.post<YuzyuzeDersResponse>(this.apiUrl, request);
  }

  update(id: number, request: YuzyuzeDersRequest): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllByDurum(durum: string): Observable<YuzyuzeDersResponse[]> {
    return this.http.get<YuzyuzeDersResponse[]>(`${this.apiUrl}/by-durum/${durum}`);
  }

  getAllOzet(): Observable<YuzyuzeDersResponse[]> {
    return this.http.get<YuzyuzeDersResponse[]>(`${this.apiUrl}/all-ozet`);
  }

  baslatmaOnayinaSun(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/baslatma-onaya-sun`, {});
  }

  baslatmaOnayla(id: number, onayNotu?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/baslatma-onayla`, onayNotu );
  }

  baslatmaReddet(id: number, redNedeni?: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/baslatma-reddet`, redNedeni );
  }

  // ==================== CSV Workflow Methods (35 adet) ====================

  icerigiEgitmeneGonder(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/icerik-egitmene-gonder`, not);
  }

  icerigiOnayaSun(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/icerik-onaya-sun`, not);
  }

  icerikOnayla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/icerik-onayla`, not);
  }

  icerikReddet(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/icerik-reddet`, not);
  }

  // --- Ücret Bilgisi Girme ---

  ucretBilgisiGir(id: number, request: UcretBilgisiGirRequest): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/ucret-bilgisi-gir`, request);
  }

  izlenceIcinEgitmeneGonder(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/izlence-egitmene-gonder`, not);
  }

  izlenceyiOnayaSun(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/izlence-onaya-sun`, not);
  }

  izlenceOnayla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/izlence-onayla`, not);
  }

  izlenceReddet(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/izlence-reddet`, not);
  }

  izlenceyeRevizeIste(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/izlence-revize-iste`, not);
  }

  egitmendenSunumIste(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/egitmenden-sunum-iste`, not);
  }

  sunumuOnayaSun(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sunum-onaya-sun`, not);
  }

  sunumuOnayla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sunum-onayla`, not);
  }

  sunumuReddet(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sunum-reddet`, not);
  }

  sunumaRevizeIste(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sunum-revize-iste`, not);
  }

  grafikTamamla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/grafik-tamamla`, not);
  }

  statikSayfaHazirla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/statik-sayfa-hazirla`, not);
  }

  smDuyurusuYap(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sm-duyurusu-yap`, not);
  }

  basvuruListele(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/basvuru-listele`, not);
  }

  onKosulRaporla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/on-kosul-raporla`, not);
  }

  sinavAtamasi(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sinav-atamasi`, not);
  }

  sinavMailiGonder(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sinav-maili-gonder`, not);
  }

  sinavRaporla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sinav-raporla`, not);
  }

  basvurulariDegerlendir(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/basvurulari-degerlendir`, not);
  }

  sozlesmeTalepEt(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sozlesme-talep-et`, not);
  }

  sozlesmeyiReddet(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sozlesme-reddet`, not);
  }

  kabulMailiGonder(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/kabul-maili-gonder`, not);
  }

  wpGrubuOlustur(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/wp-grubu-olustur`, not);
  }

  yedeklereMailGonder(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/yedeklere-mail-gonder`, not);
  }

  wpGrubunuTamamla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/wp-grubunu-tamamla`, not);
  }

  redMailiGonder(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/red-maili-gonder`, not);
  }

  dersiBaslat(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/ders-baslat`, not);
  }

  yoklamayiTamamla(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/yoklama-tamamla`, not);
  }

  anketAta(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/anket-ata`, not);
  }

  sertifikaAta(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/sertifika-ata`, not);
  }

  iptalEt(id: number, not?: string): Observable<YuzyuzeDersResponse> {
    return this.http.put<YuzyuzeDersResponse>(`${this.apiUrl}/${id}/iptal-et`, not);
  }

  // GET by Ders ID - for listing video lessons related to a parent course
  getByDersId(dersId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  // GET by multiple kategori
  getByKategoriler(kategoriIds: number[]): Observable<DersOzet[]> {
    const params = { ids: kategoriIds.join(',') };
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategoriler`, { params });
  }

  // GET by only one kategori
  getAllOzetByKategori(kategoriId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-kategori/${kategoriId}`);
  }


  // GET by Paydas ID - for listing yuzyuze lessons related to a paydas
  getAllByPaydas(paydasId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-paydas/${paydasId}`);
  }

  // GET by Proje ID - for listing yuzyuze lessons related to a proje
  getByProjeId(projeId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-proje/${projeId}`);
  }


  // GET by Egitmen ID - for listing yuzyuze lessons related to an egitmen
  getByEgitmenId(egitmenId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }
}
