import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { ShopComponent } from './marketplace/components/shop/shop.component';
import { GameDetailComponent } from './marketplace/components/game-detail/game-detail.component';
import {CheckoutComponent} from "./marketplace/components/checkout/checkout.component";
import {PayementSuccesComponent} from "./marketplace/components/payement-succes/payement-succes.component";
import {PayementFailComponent} from "./marketplace/components/payement-fail/payement-fail.component";
import {LostpasswordComponent} from "./user/lostpassword/lostpassword.component";
import {ResetPasswordComponent} from "./user/reset-password/reset-password.component";
import {RegisterComponent} from "./user/register/register.component";
import {UserDetailsComponent} from "./user/user-details/user-details.component";
import {AuthGuard} from "./user/services/auth-gard/auth-gard.service";
import {PostListComponent} from "./community/post-list/post-list.component";
import {PostDetailComponent} from "./community/post-detail/post-detail.component";
import {AddPostComponent} from "./community/add-post/add-post.component";
import {SupportComponent} from "./support/support/support.component";
import {FaqComponent} from "./support/faq/faq.component";
import {SubPayComponent} from "./support/sub-pay/sub-pay.component";
import {ReclamationComponent} from "./support/reclamation/reclamation.component";
import {SubscriptionComponent} from "./Subscriptions/components/subscription/subscription.component";
import {ShowPacksComponent} from "./Packs/components/show-packs/show-packs.component";
import {SinglePackComponent} from "./Packs/components/single-pack/single-pack.component";
import {PaymentSubComponent} from "./Subscriptions/components/payment-sub/payment-sub.component";
import {SingleGameComponent} from "./Packs/components/single-game/single-game.component";
import {GameLobyComponent} from "./cloudGaming/game-loby/game-loby.component";

const routes: Routes = [
  {path:'' , component:HomeComponent},
  { path: 'home', component: HomeComponent },
  {path : '' , redirectTo : 'HomeComponent' , pathMatch : 'full'},

  {path: 'shop', component:ShopComponent},
  {path: 'game-detail/:idArticle/:idGame', component:GameDetailComponent},
  {path: 'checkout/:idArticle', component:CheckoutComponent},
  {path: 'success', component:PayementSuccesComponent},
  {path: 'fail', component:PayementFailComponent},

  { path: 'login', component: LoginComponent },
  { path: 'lostpassword', component: LostpasswordComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  {path : 'register' , component:RegisterComponent} ,
  { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthGuard] },

  {path: 'post', component:PostListComponent},
  { path: 'post/:id', component: PostDetailComponent},
  { path: 'add-post', component: AddPostComponent},

  {path: 'support', component: SupportComponent},
  { path: 'support/faq', component: FaqComponent },
  {path: 'support/sub-pay', component: SubPayComponent},
  {path: 'support/technical', component: ReclamationComponent},

  {path: 'subscription', component: SubscriptionComponent},
  {path: 'payment', component: PaymentSubComponent},
  {path:'showPacks' , component:ShowPacksComponent},
  {path:'singlePack/:idPack' , component:SinglePackComponent},
  {path:'payment' , component:PaymentSubComponent},
  {path:'singleGame/:idGame' , component:SingleGameComponent},

  {path:'lobyGame' , component:GameLobyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
