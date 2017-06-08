import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

//Eventos de facebook
import FbEvents from '../assets/fb-events-es6';
import { Event } from './Event';

@Injectable()
export class EventsService {
	private fbEvent;
  	private mytkn;
  	
  	events: Event[] = [];

	constructor(private http: Http) { 
		this.fbEvent = new FbEvents();
		this.mytkn = localStorage.getItem('auth_token');
	}

	getAllEvents(): Observable<Event[]> {
		localStorage.setItem("storageEvents", JSON.stringify(this.events));
        return Observable.of(this.events);
    }


	searchEvents(lat, lng){
		var eventOptions = {
			lat: lat,
			lon: lng,
		//	since: 1500595200,
		//	until: 1503187200,
			filter: true
		}	
		this.fbEvent.setToken(this.mytkn)
			.then(() => {
			  return this.fbEvent.getEvents(eventOptions);
			})
			.then(evs => {
			  for(let i of evs){	
			  		//console.log(evs);		  		
			  		this.events.push({
						name: i.name,
						description: i.description,
						start_time: i.start_time,
						end_time: i.end_time,
					    attending: i.attending_count,
					    picture: i.cover.source,
					    latitude: i.venue.location.latitude,
					    longitude: i.venue.location.longitude,
					    place: i.venue.location.city
					});
			  }	 
			  localStorage.setItem("storageEvents", JSON.stringify(this.events));
			  
			})
			.catch(err => {
			  console.log(err);
			})		
	}


}


