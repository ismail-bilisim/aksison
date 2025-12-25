import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SoruVideoDersKonuResponse, SoruVideoDersKonuRequest } from '../../models/soru-ders-konu';
import { SoruRequest} from '../../models/soru-request';
import { SoruResponse} from '../../models/soru-response';
import { SoruOzet } from '../../models/soru-ozet';

@Injectable({
  providedIn: 'root'
})
export class SoruService {
  private http = inject(HttpClient);
  private soruApiUrl = `${environment.apiUrl}/soru`;
 
  // ========== Standalone Soru CRUD Methods ==========

  /**
   * Tüm soruları özet olarak getirir
   */
  getAllOzet(): Observable<SoruOzet[]> {
    return this.http.get<SoruOzet[]>(`${this.soruApiUrl}/all-ozet`);
  }

  /**
   * ID'ye göre soru detayını getirir
   */
  getById(id: number): Observable<SoruResponse> {
    return this.http.get<SoruResponse>(`${this.soruApiUrl}/${id}`);
  }

  /**
   * Yeni soru oluşturur
   */
  create(request: SoruRequest): Observable<SoruResponse> {
    return this.http.post<SoruResponse>(this.soruApiUrl, request);
  }

  /**
   * Mevcut soruyu günceller
   */
  update(id: number, request: SoruRequest): Observable<SoruResponse> {
    return this.http.put<SoruResponse>(`${this.soruApiUrl}/${id}`, request);
  }

  /**
   * Soruyu siler
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.soruApiUrl}/${id}`);
  }

}