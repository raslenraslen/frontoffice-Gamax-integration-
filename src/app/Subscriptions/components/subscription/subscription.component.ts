import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../models/subscription';
import { Router } from "@angular/router";
import {AuthenticationService} from "../../../user/services/login/authentification.service";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  message: string = '';
  error: string = '';
  userId: number = 4;
  hasSubscription: boolean = false;

  formattedDates: {
    day: number;
    month: number;
    year: number;
    hours: number;
    minutes: number;
    seconds: number;
  }[] = [];

  constructor(
    private subscriptionService: SubscriptionService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authenticationService.currentUserValue?.userId;
    console.log(this.userId);
    this.checkUser(this.userId);

  }

  buyNow(subscriptionType: string): void {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const newSubscription: Subscription = {
      userId: this.userId,
      startingDate: startDate.toISOString(),
      expirationDate: endDate.toISOString(),
      subscriptionType
    };

    this.subscriptionService.saveSubscription(newSubscription).subscribe({
      next: (response) => {
        this.message = 'Subscription created successfully!';
        this.error = '';
        console.log(this.message, response);

        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/payment']);
        }, 3000);
      },
      error: (err) => {
        this.error = 'Error creating subscription';
        this.message = '';
        console.error(this.error, err);

        setTimeout(() => {
          this.error = '';
          this.router.navigate(['/payment']);
        }, 3000);
      }
    });
  }

  checkUser(userId: number): void {
    this.subscriptionService.getSubscriptionsUser(userId).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.hasSubscription = true;
          this.formattedDates = response.map(item => {
            const date = new Date(item.expirationDate);
            return {
              day: date.getDate(),
              month: date.getMonth() + 1,
              year: date.getFullYear(),
              hours: date.getHours(),
              minutes: date.getMinutes(),
              seconds: date.getSeconds()
            };
          });
        } else {
          this.hasSubscription = false;
        }
      },
      error: () => {
        this.hasSubscription = false;
      }
    });
  }
}
