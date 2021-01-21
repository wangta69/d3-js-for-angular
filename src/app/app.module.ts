import { BrowserModule } from '@angular/platform-browser';
import { LineTransitoin1Module } from './pages/linetransition1/linetransition1.module';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LineTransitoin1Module,
  ],
  providers: [],
  bootstrap: [
      AppComponent,
  ]
})
export class AppModule { }
