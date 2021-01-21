import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'linetransition1', pathMatch: 'full' },
    { path: 'linetransition1', loadChildren: () => import('./pages/linetransition1/linetransition1.module').then( (m) => m.LineTransitoin1Module)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
