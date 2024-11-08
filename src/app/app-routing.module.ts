import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogementListComponent } from './Features/logement-list/logement-list.component';

const routes: Routes = [
  { path: 'logements', component: LogementListComponent },
  { path: '', redirectTo: '/logements', pathMatch: 'full' }  // Redirige vers 'logements' par défaut
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
