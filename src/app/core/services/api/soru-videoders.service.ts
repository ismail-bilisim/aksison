import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SoruVideoDersKonuResponse, SoruVideoDersKonuRequest } from '../../models/soru-ders-konu';
import { SoruRequest} from '../../models/soru-request';
import { SoruResponse} from '../../models/soru-response';
import { SoruOzet } from '../../models/soru-ozet';
import { DersOzet } from '../../models/ders-ozet';
import { KonuOzet } from '../../models/konu-ozet';

@Injectable({
  providedIn: 'root'
})
export class SoruService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/soruvideoderskonu`;

  // ========== Standalone Soru CRUD Methods ==========

 
  /**
   * Belirli bir soruya ait ilişkili VideoDers ve Konu listelerini getirir
   */
  getAllDersOzetBysoruId(soruId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/ders/by-soru/${soruId}`);
  }

  getAllKonuOzetBySoruId(soruId: number): Observable<KonuOzet[]> {
    return this.http.get<KonuOzet[]>(`${this.apiUrl}/konu/by-soru/${soruId}`);
  }

  // ========== SoruVideoDersKonu Relationship Methods ==========

  /**
   * Belirli bir derse ait tüm soruları getirir
   */
  getAllByDersId(dersId: number): Observable<SoruVideoDersKonuResponse[]> {
    return this.http.get<SoruVideoDersKonuResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  /**
   * Belirli bir konuya ait soruları getirir
   */
  getAllByKonuId(konuId: number): Observable<SoruVideoDersKonuResponse[]> {
    return this.http.get<SoruVideoDersKonuResponse[]>(`${this.apiUrl}/by-konu/${konuId}`);
  }

  /**
   * Yeni soru ilişkisi oluşturur (ders/konu ile soru arasında)
   */
  createRelation(request: SoruVideoDersKonuRequest): Observable<SoruVideoDersKonuResponse> {
    return this.http.post<SoruVideoDersKonuResponse>(this.apiUrl, request);
  }

  /**
   * Soru ilişkisini siler
   */
  deleteDersSoru(dersSoruId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, {
      params: { 
        dersSoruId: dersSoruId.toString()
      }
    });
  }
}