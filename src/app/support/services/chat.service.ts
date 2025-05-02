import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface ChatBotResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  private apiKey = 'sk-ea124c0171ed48b09a8c83e12c795f7c';

  constructor(private http: HttpClient) { }

  getChatResponse(userInput: string, context: any[] = []): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const systemPrompt = `
      You are GameMax's official cloud gaming assistant. Your responsibilities:
      
      1. RECLAMATION ASSISTANCE:
      - Guide users through filing reclamations
      - Suggest professional wording
      

      2. PLATFORM HELP:
      - Explain GameMax features
      - Troubleshoot common issues
      - Guide through account settings

      3. RULES:
      - ONLY discuss GameMax services
      - Redirect unrelated queries politely
      - Always provide 3 clear options
      

      Current Date: ${new Date().toLocaleDateString()}
      Platform Status: Operational
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userInput }
    ];

    const body = {
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.6,
      max_tokens: 250
    };

    return this.http.post<ChatBotResponse>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        const content = response.choices[0]?.message?.content;
        return this.formatResponse(content);
      }),
      catchError(() => of("Our support system is temporarily unavailable. Please email support@gamemax.com"))
    );
  }

  private formatResponse(response: string): string {
    // Ensure response ends with options
    if (!/\n\d\)/.test(response)) {
      return `${response}\n\nWhat would you like to do next?\n1) Continue reclamation\n2) Ask another question\n3) End chat`;
    }
    return response;
  }
}