import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudService {


// private readonly BASE_URL_ARTICLE = 'http://localhost:8080/api/articles';
  // private readonly BASE_URL_REVIEW = 'http://localhost:8080/api/games/reviews';
  // private readonly BASE_URL_COUPON = 'http://localhost:8080/api/coupons';

  private readonly BASE_URL_inst = `${environment.apiUrl}/instance/`;
  
  private readonly BASE_URL_flv = `${environment.apiUrl}/flavor/`;
  
  private readonly BASE_URL_glance = `${environment.apiUrl}/glance/`;
  
  private readonly BASE_URL_net = `${environment.apiUrl}/network/`;
  
  private readonly BASE_URL_cind = `${environment.apiUrl}/cinder/`;


  constructor(private http: HttpClient) { }

  getInstancesAll(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL_inst}/all`);
  }

  getInstancesOnline(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL_inst}/online`);
  }

  postInstances(gameId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL_inst}/${gameId}/launch`, {});
  }


  }





