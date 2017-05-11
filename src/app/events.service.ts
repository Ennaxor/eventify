import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EventsService {

  constructor(private http: Http) { }

  // Get all events from the FACEBOOK API
  getAllEvents() {
    return this.http.get('/api/events')
      .map(res => res.json());
  }
}
