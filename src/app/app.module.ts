import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';

import { EventsService } from './events.service';

//MODULO DE FACEBOOK
import { FacebookModule } from 'ngx-facebook';

//MODULO DE GOOGLE MAPS
import { AgmCoreModule } from 'angular2-google-maps/core';

//EVENTOS FACEBOOK
//import { FacebookEventsModule } from 'facebook-events-by-location';


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
    RouterModule.forRoot(ROUTES), //añade la ruta a la app
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-maeGYU-LxKvFNdp-APTGVQrNMsErmCA'
    })
    //FacebookEventsModule.forRoot()
  ],
  providers: [EventsService], //añadir el servicio aqui
  bootstrap: [AppComponent]
})
export class AppModule { }
