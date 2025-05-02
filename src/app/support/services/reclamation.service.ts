import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/user/services/login/authentification.service';
import {environment} from "../../environments/environment";

interface PredictionResponse {
  predictedType: string;
}

@Injectable({
  providedIn: 'root'
})

export class ReclamationService {
  private readonly baseUrl = `${environment.apiUrl}/reclamation`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}
  predictType(description: string): Observable<PredictionResponse> {
    const payload = { description: description };
    return this.http.post<PredictionResponse>(`${this.baseUrl}/predict-type`, payload);
  }

  addRec( rec: any): Observable<any> {
    const userId = this.authService.currentUserValue?.userId;
    return this.http.post(`${this.baseUrl}/addRec/${userId}`, rec);
  }

  getRecsByUser(): Observable<any[]> {
    const userId = this.authService.currentUserValue?.userId;
    return this.http.get<any[]>(`${this.baseUrl}/myRecs/${userId}`);
  }

  updateRec(id_rec: number, rec: any): Observable<any> {
    const userId = this.authService.currentUserValue?.userId;
    return this.http.put(`${this.baseUrl}/updateRec/${userId}/${id_rec}`, rec);
  }

  removeRec(id_rec: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removeRec/${id_rec}`);
  }

  uploadAttachment(recId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/attachments/upload/${recId}`, formData);
  }

  previewAttachment(attachmentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/attachments/preview/${attachmentId}`, { responseType: 'blob' });
  }
}
