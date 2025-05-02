import { Component } from '@angular/core';
import {Subscription} from "../../models/subscription";
import {SubscriptionService} from "../../services/subscription.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-sub',
  templateUrl: './payment-sub.component.html',
  styleUrls: ['./payment-sub.component.css']

})
export class PaymentSubComponent {

  message: string = '';
  error: string = '';

  constructor(private router: Router
  ) {

  }
  pay() {

      this.message = 'Subscription payed successfully!';
      this.error = '';
    setTimeout(() => {
      this.message = '';
      this.router.navigate(['/showPacks']);
    }, 3000);



  }

}
