// subscription.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;
  private apiUrl_ = `${environment.apiUrl}/packs`;

  constructor(private http: HttpClient) { }

  // Save a new subscription
  saveSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/saveSubscription`, subscription);
  }

  // Get all subscriptions
  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }
  getSubscriptionsUser(idUser:number): Observable<any[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/userSub/${idUser}`);
  }

  getPacksUser(idSub:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl_}/by-plan/${idSub}`);
  }

  // Get subscription by ID
  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${id}`);
  }

  // Update a subscription
  updateSubscription(id: number, subscription: Subscription): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}`, subscription);
  }

  // Delete a subscription
  deleteSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
