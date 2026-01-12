import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EgitmenSertifikaResponse } from '../../models/egitmen-sertifika-response';

@Injectable({ providedIn: 'root' })
export class EgitmenSertifikaService {
  private apiUrl = `${environment.apiUrl}/egitmen-sertifika`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, egitmenId: number): Observable<EgitmenSertifikaResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('egitmenId', egitmenId.toString());
    return this.http.post<EgitmenSertifikaResponse>(`${this.apiUrl}/upload`, formData);
  }

  getFilesByEgitmenId(egitmenId: number): Observable<EgitmenSertifikaResponse[]> {
    return this.http.get<EgitmenSertifikaResponse[]>(`${this.apiUrl}/by-egitmen/${egitmenId}`);
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
