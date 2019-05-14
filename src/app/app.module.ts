import {BrowserModule} from '@angular/platform-browser';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {ErrorComponent} from './components/error/error.component';
import {WaitComponent} from './components/wait/wait.component';
import {Settings} from './const/settings';
import {HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ErrorComponent,
    WaitComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ScrollingModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [
    Settings,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
