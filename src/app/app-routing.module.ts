import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogementListComponent } from './Features/logement-list/logement-list.component';
import { HomeComponent } from './Features/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'logements/:id', component: LogementListComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
