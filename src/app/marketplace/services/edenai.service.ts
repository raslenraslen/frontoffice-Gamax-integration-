import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EdenaiService {
  private apiUrl = 'https://api.edenai.run/v2/text/moderation';
  private apiKey = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjc3NGE4YmUtMGRiOS00ODdkLTg1NzgtZGJlZDBlNGQwZTQ3IiwidHlwZSI6ImFwaV90b2tlbiJ9.nv3JabXAfy0yiBopXKIIqE1dtqlUfyyi3-vMkpEgXzc';

  constructor(private http: HttpClient) {}

  moderateText(text: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.apiKey,
      'Content-Type': 'application/json',
    });

    const body = {
      providers: 'openai',
      text: text,
      language: 'en',
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
