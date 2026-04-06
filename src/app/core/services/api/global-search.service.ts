import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalSearchResult } from '../../models/global-search-result';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  private readonly apiUrl = `${environment.apiUrl}/search`;

  constructor(private readonly http: HttpClient) {}

  search(query: string, type?: string): Observable<GlobalSearchResult[]> {
    let params = new HttpParams().set('query', query.trim());
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<GlobalSearchResult[]>(this.apiUrl, { params });
  }
}
