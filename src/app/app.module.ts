import { BrowserModule } from '@angular/platform-browser';
import { LineChartModule } from '../components/line1.module';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LineChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
