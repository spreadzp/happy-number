
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LotoComponent } from './loto/loto.component';
import { MetaSenderComponent } from './meta/meta-sender/meta-sender.component';
import { StatisticComponent } from './statistic/statistic.component';

const routes: Routes = [
  { path: '', component: LotoComponent },
  { path: 'statistic', component: StatisticComponent },
  { path: 'meta', component: MetaSenderComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
