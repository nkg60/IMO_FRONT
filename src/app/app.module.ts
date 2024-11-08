// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogementListComponent } from './Features/logement-list/logement-list.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Features/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LogementListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
