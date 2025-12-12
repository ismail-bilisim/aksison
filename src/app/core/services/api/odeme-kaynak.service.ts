import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OdemeKaynak } from 'src/app/core/models/odeme-kaynak';

@Injectable({
  providedIn: 'root'
})
export class OdemeKaynakService {
  private baseUrl = `${environment.apiUrl}/odeme-kaynak`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OdemeKaynak[]> {
    return this.http.get<OdemeKaynak[]>(this.baseUrl);
  }
}
