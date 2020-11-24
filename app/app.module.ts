import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitMenuComponent } from './init-menu/init-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { WebResearchComponent } from './web-research/web-research.component';

import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    InitMenuComponent,
    MainMenuComponent,
    WebResearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
