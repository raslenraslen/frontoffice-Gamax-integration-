import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}


@Injectable({
  providedIn: 'root'
})
export class DeepSeekServiceService {
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  private apiKey = 'sk-ea124c0171ed48b09a8c83e12c795f7c';

  constructor(private http: HttpClient) {
  }

  getGameDetails(description: string, gameNames: string[]): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const gameDetailsPrompt = `
      You are a video game expert AI. Based on the following description: "${description}", and the list of game names: ${gameNames.join(', ')}, identify the most relevant games that match the description. If no relevant match is found, return: "No relevant game found."

Return the result in the following JSON format:
{
  "games": [
    {
      "name": "game name"
    },
  ]
}

    `;

    const body = {
      model: 'deepseek-chat',
      messages: [
        {role: 'system', content: gameDetailsPrompt},
        {role: 'user', content: `Find the most relevant game for the description: "${description}"`}
      ],
      temperature: 0.3
    };

    return this.http.post<DeepSeekResponse>(this.apiUrl, body, {headers}).pipe(
      map(response => response.choices[0]?.message?.content || "Aucune correspondance trouvée"),
      catchError(() => of("Erreur lors de la récupération des détails des jeux"))
    );
  }
}
