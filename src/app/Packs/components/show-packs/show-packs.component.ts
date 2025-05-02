import { Component, OnInit } from '@angular/core';
import { PacksService } from '../../services/packs.service';
import { Pack } from '../../models/pack'; // Ensure the import path is correct
import { Router } from '@angular/router';
import {SubscriptionService} from "../../../Subscriptions/services/subscription.service";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-show-packs',
  templateUrl: './show-packs.component.html',
  styleUrls: ['./show-packs.component.css']
})
export class ShowPacksComponent implements OnInit {
  packs: any[] = [];
  subs: any[] = [];
  sub:number = 1;
  a:number = 0;

  categories: string[] = [];
  filteredPacks: any[] = [];
  selectedCategory: string = 'All';
  baseUrl: string= environment.apiUrlImg;


  constructor(private packService: PacksService,private subService: SubscriptionService,private router: Router) {}

  ngOnInit(): void {
    this.getSubs();
    this.filterPacks('All');
  }

  getCategoriesFromPacks() {
    const allCategories = this.packs.map(p => p.categorie?.nom?.trim().replace(/"/g, '') || 'Uncategorized');
    this.categories = ['All', ...Array.from(new Set(allCategories))];
    //console.log(this.categories);
  }
 getSubs(){
   this.subService.getSubscriptionsUser(2).subscribe({
     next: (response: any[]) => {
       console.log();
       if (response[0].subscriptionType=="STANDARD"){
         this.sub =3;
       }
       else if (response[0].subscriptionType=="BASIC"){
         this.sub =1;
       }
       else if (response[0].subscriptionType=="PREMIUM"){
         this.sub =2;
       }


       // this.sub=this.subs[0].idSubscription;
       this.getPacksUser();

     },
     error: (err) => {
       console.error('Error fetching packs:', err);
     },
   });
 }

  filterPacks(category: string) {
   // console.log(category);

    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredPacks = this.packs;
    } else {
      this.filteredPacks = this.packs.filter(p => p.categorie?.nom?.trim().replace(/"/g, '') === category);
    }
  }



  getPacksUser(){
     console.log(this.sub );

    this.subService.getPacksUser(this.sub).subscribe({
      next: (response: any[]) => {
       // console.log('Received packs:', response);
        this.packs = response;
        this.getCategoriesFromPacks();
      },
      error: (err) => {
        console.error('Error fetching packs:', err);
      },
    });
  }
}
