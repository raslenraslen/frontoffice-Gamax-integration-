import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { Pack } from '../models/pack';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PacksService {
  private apiUrl = `${environment.apiUrl}/packs/allPacks`;
  private apiUrl_ = `${environment.apiUrl}/packs`;

  constructor(private http: HttpClient) {}

  getAllPacks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(packs => packs)
    );
  }


  getPackById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl_}/getPack/${id}`).pipe(
      map(pack => pack),
      catchError(error => {
        console.error('Error fetching pack by ID:', error);
        return throwError(() => new Error('Failed to load pack'));
      })
    );
  }

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl_}/games`).pipe(
      catchError(error => {
        console.error('Error fetching games:', error);
        return throwError(() => new Error('Failed to load games'));
      })
    );
  }
}
