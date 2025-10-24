import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VideoDers } from 'src/app/core/models/videoders';

@Injectable({ providedIn: 'root' })
export class VideodersService {
  private apiUrl = `${environment.apiUrl}/videoders`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<VideoDers[]> {
    return this.http.get<VideoDers[]>(this.apiUrl);
  }

  getByKodu(kodu: number): Observable<VideoDers> {
    return this.http.get<VideoDers>(`${this.apiUrl}/${kodu}`);
  }

  create(videoDers: VideoDers): Observable<VideoDers> {
    return this.http.post<VideoDers>(this.apiUrl, videoDers);
  }

  update(kodu: number, videoDers: VideoDers): Observable<VideoDers> {
    return this.http.put<VideoDers>(`${this.apiUrl}/${kodu}`, videoDers);
  }

  delete(kodu: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${kodu}`);
  }
}

