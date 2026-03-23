import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DersMateryalResponse } from '../../models/ders-materyal-response';
import { MedyaTuruOzet } from '../../models/medya-turu-ozet';

@Injectable({
  providedIn: 'root'
})
export class YuzyuzeDersMateryalService {
  private apiUrl = `${environment.apiUrl}/yuzyuzedersmateryaller`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, dersId: number, medyaTuruId: number): Observable<DersMateryalResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('dersId', dersId.toString());
    formData.append('medyaTuruId', medyaTuruId.toString());
    return this.http.post<DersMateryalResponse>(`${this.apiUrl}/upload`, formData);
  }

  getByDersId(dersId: number): Observable<DersMateryalResponse[]> {
    return this.http.get<DersMateryalResponse[]>(`${this.apiUrl}/ders/${dersId}`);
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMedyaTurleri(): Observable<MedyaTuruOzet[]> {
    return this.http.get<MedyaTuruOzet[]>(`${this.apiUrl}/medya-turleri`);
  }
}
