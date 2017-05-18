import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
	selector: 'app-events',
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

	//inicializar eventos en array vacío
	events: any = [];

	constructor(private eventsService: EventsService) { }

	ngOnInit() {		
		// Retrieve events from the API
	    this.eventsService.getAllEvents().subscribe(events => {
	      this.events = events;
	    });
	}

}
