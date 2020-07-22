import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
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
  MatTableModule,
  MatSnackBarModule
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
import { Web3Service } from './util/web3.service';
import { BalanceComponent } from './balance/balance.component';
import { ExchangeComponent } from './exchange/exchange.component';

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
    RulesComponent,
    BalanceComponent,
    ExchangeComponent,
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
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [Web3Service, LotoService, JpService, ShowPageService],
  bootstrap: [AppComponent],
})
export class AppModule { }
