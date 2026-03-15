import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SoruVideoDersKonuResponse, SoruVideoDersKonuRequest } from '../../models/soru-ders-konu';
import { DersOzet } from '../../models/ders-ozet';
import { KonuOzet } from '../../models/konu-ozet';

@Injectable({
  providedIn: 'root'
})
export class SoruYuzyuzedersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/soruyuzyuzederskonu`;

  getAllDersOzetBysoruId(soruId: number): Observable<DersOzet[]> {
    return this.http.get<DersOzet[]>(`${this.apiUrl}/ders/by-soru/${soruId}`);
  }

  getAllKonuOzetBySoruId(soruId: number): Observable<KonuOzet[]> {
    return this.http.get<KonuOzet[]>(`${this.apiUrl}/konu/by-soru/${soruId}`);
  }

  getAllByDersId(dersId: number): Observable<SoruVideoDersKonuResponse[]> {
    return this.http.get<SoruVideoDersKonuResponse[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  getAllByKonuId(konuId: number): Observable<SoruVideoDersKonuResponse[]> {
    return this.http.get<SoruVideoDersKonuResponse[]>(`${this.apiUrl}/by-konu/${konuId}`);
  }

  createRelation(request: SoruVideoDersKonuRequest): Observable<SoruVideoDersKonuResponse> {
    return this.http.post<SoruVideoDersKonuResponse>(this.apiUrl, request);
  }

  deleteDersSoru(dersSoruId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl, {
      params: {
        dersSoruId: dersSoruId.toString()
      }
    });
  }
}
