import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitMenuComponent } from './init-menu/init-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { WebResearchComponent } from './web-research/web-research.component';

import { CookieService } from 'ngx-cookie-service';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';

@NgModule({
  declarations: [
    AppComponent,
    InitMenuComponent,
    MainMenuComponent,
    WebResearchComponent,
    SpeechToTextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
