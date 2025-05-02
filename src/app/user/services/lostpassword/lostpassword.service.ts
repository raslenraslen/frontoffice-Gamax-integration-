import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LostpasswordService {

  private apiUrl = `${environment.apiUrlImg}/api/auth`;

  constructor(private http: HttpClient) {
  }

  requestPasswordReset(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/request-reset-password`, {}, {params});
  }

  validateResetEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/validate-reset-email`, {}, {params});
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    const params = new HttpParams().set('email', email).set('newPassword', newPassword);
    return this.http.post(`${this.apiUrl}/reset-password`, {}, {params});
  }
}
