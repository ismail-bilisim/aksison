import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VideodersMateryalResponse } from '../../models/videoders-materyal-response';
import { MedyaTuruOzet } from '../../models/medya-turu-ozet';

@Injectable({
  providedIn: 'root'
})
export class VideodersMateryalService {
  private apiUrl = `${environment.apiUrl}/videodersmateryaller`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, dersId: number, medyaTuruId: number): Observable<VideodersMateryalResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('dersId', dersId.toString());
    formData.append('medyaTuruId', medyaTuruId.toString());
    return this.http.post<VideodersMateryalResponse>(`${this.apiUrl}/upload`, formData);
  }

  getByDersId(dersId: number): Observable<VideodersMateryalResponse[]> {
    return this.http.get<VideodersMateryalResponse[]>(`${this.apiUrl}/ders/${dersId}`);
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
