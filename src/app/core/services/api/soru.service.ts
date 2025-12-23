import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SoruVideoDersKonuResponse, SoruVideoDersKonuRequest } from '../../models/soru-videoders-konu';

@Injectable({
  providedIn: 'root'
})
export class SoruService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/soruvideoderskonu`;

  /**
   * Belirli bir derse ait tüm soruları getirir
   */
  getAllByDersId(dersId: number): Observable<SoruVideoDersKonuResponse[]> {
    return this.http.get<SoruVideoDersKonuResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  /**
   * Belirli bir ders ve konuya ait soruları getirir
   */
  getAllByDersIdAndKonuId(dersId: number, konuId: number): Observable<SoruVideoDersKonuResponse[]> {
    return this.http.get<SoruVideoDersKonuResponse[]>(`${this.apiUrl}/by-ders-konu/${dersId}/${konuId}`);
  }

  /**
   * Yeni soru ilişkisi oluşturur
   */
  create(request: SoruVideoDersKonuRequest): Observable<SoruVideoDersKonuResponse> {
    return this.http.post<SoruVideoDersKonuResponse>(this.apiUrl, request);
  }

  /**
   * Soru ilişkisini siler
   */
  delete(dersId: number, konuId: number, soruId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, {
      params: { 
        dersId: dersId.toString(), 
        konuId: konuId.toString(), 
        soruId: soruId.toString() 
      }
    });
  }
}