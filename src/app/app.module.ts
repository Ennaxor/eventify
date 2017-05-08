import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';

import { EventsService } from './events.service';

// RUTA
const ROUTES = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    component: EventsComponent
  }
];



@NgModule({
  declarations: [
    AppComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) //añade la ruta a la app
  ],
  providers: [EventsService], //añadir el servicio aqui
  bootstrap: [AppComponent]
})
export class AppModule { }
