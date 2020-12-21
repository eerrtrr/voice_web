import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitMenuComponent } from './init-menu/init-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

import { PageLeftComponent } from './page-left/page-left.component';
import { PageRightComponent } from './page-right/page-right.component';
import { PageCenterComponent } from './page-center/page-center.component';

@NgModule({
  declarations: [
    AppComponent,
    InitMenuComponent,
    MainMenuComponent,
    PageLeftComponent,
    PageRightComponent,
    PageCenterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule{}
