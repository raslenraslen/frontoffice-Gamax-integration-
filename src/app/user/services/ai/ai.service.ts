// Dans src/app/services/ai/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

interface UsernameDescriptionRequest {
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private backendUrl = `${environment.apiUrlAiRaslen}/ai`;

  constructor(private http: HttpClient) { }


  generateUsernames(description: string): Observable<string> {
    const requestBody: UsernameDescriptionRequest = { description: description };


    return this.http.post(`${this.backendUrl}/generate-usernames`, requestBody, { responseType: 'text' })
      .pipe(
        tap(response => {
          console.log("AiService - Réponse 200 OK reçue du backend (texte brut):", response);
        }),


      );
  }

  suggestSimilarUsernames(existingUsername: string): Observable<string[]> {
    const requestBody: UsernameDescriptionRequest = { description: existingUsername };

    return this.http.post<string[]>(`${this.backendUrl}/suggest-similar-username`, requestBody)
      .pipe(
        tap(response => {
          console.log("AiService - Réponse 200 OK reçue du backend (suggestions similaires):", response);
        }),

      );
  }



}
