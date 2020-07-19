
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LotoComponent } from './loto/loto.component';
import {MetaSenderComponent} from './meta/meta-sender/meta-sender.component';

const routes: Routes = [
  {
    path: '',
    children: [
    //   {
    //     path: '',
    //     loadChildren: () =>
    //       import('./views/base/index/index.module').then((m) => m.IndexModule),
    //   },
    //   {
    //     path: 'products',
    //     loadChildren: () =>
    //       import('./views/pages/product/product.module').then(
    //         (m) => m.ProductModule
    //       ),
    //   },
    //   {
    //     path: 'users',
    //     loadChildren: () =>
    //       import('./views/pages/user/user.module').then((m) => m.UserModule),
    //   },
    //   {
    //     path: 'task-board',
    //     loadChildren: () =>
    //       import('./views/pages/task-board/task-board.module').then(
    //         (m) => m.TaskBoardModule
    //       ),
    //   },
    ],
  },
  { path: 'meta', component: MetaSenderComponent },
  
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
