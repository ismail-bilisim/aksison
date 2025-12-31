import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TalepEkDosyaResponse } from '../../models/talep-ek-dosya';

@Injectable({
  providedIn: 'root'
})
export class TalepEkDosyaService {
  private apiUrl = `${environment.apiUrl}/talep-ek-dosya`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, talepId: number): Observable<TalepEkDosyaResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('talepId', talepId.toString());
    // userId is taken from security context in backend, so no need to send it from here

    return this.http.post<TalepEkDosyaResponse>(`${this.apiUrl}/upload`, formData);
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }

  getFilesByTalepId(talepId: number): Observable<TalepEkDosyaResponse[]> {
    return this.http.get<TalepEkDosyaResponse[]>(`${this.apiUrl}/by-talep/${talepId}`);
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
