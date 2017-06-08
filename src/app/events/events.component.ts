import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

import { Event } from '../Event';

@Component({
	selector: 'app-events',
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

	//inicializar eventos en array vacío
	//events: any = [];
	events: Event[];


	constructor(private eventsService: EventsService) { }

	ngOnInit() {				
	//	this.showEvents();
	}

	showEvents(){
	//	this.events = this.eventsService.getAllEvents();
		//console.log("events in component", this.events);
	}

}
