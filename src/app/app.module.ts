import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import {MetaModule} from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';
import { LotoComponent } from './loto/loto.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BallComponent } from './ball/ball.component';
import { WinBallsComponent } from './win-balls/win-balls.component';
import { LotoService } from './util/loto.service';
import { JpService } from './util/jp.service';

@NgModule({
  declarations: [
    AppComponent,
    LotoComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    BallComponent,
    WinBallsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MetaModule,
    AppRoutingModule
  ],
  providers: [LotoService, JpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
