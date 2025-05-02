import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderDefaultComponent } from './headers/header-default/header-default.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderHomeComponent } from './headers/header-home/header-home.component';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './marketplace/components/shop/shop.component';
import { GameDetailComponent } from './marketplace/components/game-detail/game-detail.component';
import { BootstrapCarouselComponent } from './marketplace/components/bootstrap-carousel/bootstrap-carousel.component';
import { CheckoutComponent } from './marketplace/components/checkout/checkout.component';
import { PayementSuccesComponent } from './marketplace/components/payement-succes/payement-succes.component';
import { PayementFailComponent } from './marketplace/components/payement-fail/payement-fail.component';
import { LoginComponent } from './user/login/login.component';
import {UsernameGeneratorComponent} from "./user/ai/username-generator/username-generator.component";
import { RegisterComponent } from './user/register/register.component';
import { LostpasswordComponent } from './user/lostpassword/lostpassword.component';
import { SidemenuComponent } from './user/sidemenu/sidemenu.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { PostListComponent } from './community/post-list/post-list.component';
import { PostDetailComponent } from './community/post-detail/post-detail.component';
import { AddPostComponent } from './community/add-post/add-post.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SupportComponent } from './support/support/support.component';
import { FaqComponent } from './support/faq/faq.component';
import { SubPayComponent } from './support/sub-pay/sub-pay.component';
import { ReclamationComponent } from './support/reclamation/reclamation.component';
import { ChatbotComponent } from './support/chatbot/chatbot.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SubscriptionComponent } from './Subscriptions/components/subscription/subscription.component';
import { ShowPacksComponent } from './Packs/components/show-packs/show-packs.component';
import { SinglePackComponent } from './Packs/components/single-pack/single-pack.component';
import { PaymentSubComponent } from './Subscriptions/components/payment-sub/payment-sub.component';
import { SingleGameComponent } from './Packs/components/single-game/single-game.component';
import { GameLobyComponent } from './cloudGaming/game-loby/game-loby.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = {
  url: 'http://localhost:5000',
  options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderDefaultComponent,
    FooterComponent,
    HeaderHomeComponent,
    HomeComponent,
    ShopComponent,
    GameDetailComponent,
    BootstrapCarouselComponent,
    CheckoutComponent,
    PayementSuccesComponent,
    PayementFailComponent,
    LoginComponent,
    UsernameGeneratorComponent,
    RegisterComponent,
    LostpasswordComponent,
    SidemenuComponent,
    UserDetailsComponent,
    ResetPasswordComponent,
    PostListComponent,
    PostDetailComponent,
    AddPostComponent,
    SupportComponent,
    FaqComponent,
    SubPayComponent,
    ReclamationComponent,
    ChatbotComponent,
    SubscriptionComponent,
    ShowPacksComponent,
    SinglePackComponent,
    PaymentSubComponent,
    SingleGameComponent,
    GameLobyComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FontAwesomeModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
