import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoDersKonu, VideoDersKonuRequest } from '../models/videoders-konu';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoDersKonuService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/videoderskonu`;

  /**
   * Get all topics for a video course in proper order (sorted by bolumNumara, konuSiraNo)
   */
  getAllByDersIdOrdered(dersId: number): Observable<VideoDersKonu[]> {
    return this.http.get<VideoDersKonu[]>(`${this.apiUrl}/by-ders/${dersId}/ordered`);
  }

  /**
   * Get all topics for a video course (unordered)
   */
  getAllByDersId(dersId: number): Observable<VideoDersKonu[]> {
    return this.http.get<VideoDersKonu[]>(`${this.apiUrl}/by-ders/${dersId}`);
  }

  /**
   * Create a new topic
   */
  create(request: VideoDersKonuRequest): Observable<VideoDersKonu> {
    return this.http.post<VideoDersKonu>(this.apiUrl, request);
  }

  /**
   * Delete a topic by dersId and bolumNumara
   */
  delete(dersId: number, bolumNumara: number): Observable<void> {
    const params = new HttpParams()
      .set('dersId', dersId.toString())
      .set('bolumNumara', bolumNumara.toString());
    return this.http.delete<void>(this.apiUrl, { params });
  }

  /**
   * Move a topic to a new position
   */
  moveKonu(konuId: number, newPosition: number): Observable<void> {
    const params = new HttpParams().set('newPosition', newPosition.toString());
    return this.http.put<void>(`${this.apiUrl}/${konuId}/move`, null, { params });
  }

  /**
   * Calculate the insert position between two existing positions
   * @param afterPosition - Position after which to insert (null for beginning)
   * @param beforePosition - Position before which to insert (null for end)
   */
  calculateInsertPosition(
    dersId: number,
    bolumNumara: number,
    afterPosition?: number,
    beforePosition?: number
  ): Observable<number> {
    let params = new HttpParams();
    if (afterPosition !== undefined && afterPosition !== null) {
      params = params.set('afterPosition', afterPosition.toString());
    }
    if (beforePosition !== undefined && beforePosition !== null) {
      params = params.set('beforePosition', beforePosition.toString());
    }
    return this.http.get<number>(
      `${this.apiUrl}/ders/${dersId}/bolum/${bolumNumara}/calculate-position`,
      { params }
    );
  }

  /**
   * Manually trigger rebalancing for a section
   */
  rebalanceKonular(dersId: number, bolumNumara: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/ders/${dersId}/bolum/${bolumNumara}/rebalance`,
      null
    );
  }
}
