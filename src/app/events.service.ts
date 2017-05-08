import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EventsService {

  constructor(private http: Http) { }

  // Get all events from the API
  getAllEvents() {
    return this.http.get('/api/posts')
      .map(res => res.json());
  }
}
