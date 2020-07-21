import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MetaModule } from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatTableModule
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
import { FinishComponent } from './finish/finish.component';
import { StatisticComponent } from './statistic/statistic.component';
import { ShowPageService } from './util/showPage.service';
import { InfoComponent } from './info/info.component';
import { RulesComponent } from './rules/rules.component';

@NgModule({
  declarations: [
    AppComponent,
    LotoComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    BallComponent,
    WinBallsComponent,
    FinishComponent,
    StatisticComponent,
    InfoComponent,
    RulesComponent
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
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule
  ],
  providers: [LotoService, JpService, ShowPageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
