import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent} from 'ngx-facebook';

import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

import * as myGlobals from '../../globals'; 

//Eventos de facebook
import FbEvents from '../assets/fb-events-es6';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'Login con FACEBOOK y mapa de GOOGLE';
	lat: number = 51.678418;
  	lng: number = 7.809007;
  	zoom: number = 8;

  	private loggedIn = false;
  	private fbEvent;
  	private mytkn;

  	//called first time before ngOninit()  	
	constructor(private fb: FacebookService, 
				private http: Http,
				private router: Router) {

		console.log('Initializing Facebook');

		fb.init({
			appId: '631545433723193',
			version: 'v2.9'
		});

		this.fbEvent = new FbEvents();

	    this.loggedIn = !!localStorage.getItem('auth_token');
	}

	//called after the constructor and called  after the first ngOnChanges() 
	ngOnInit(){
		this.mytkn = localStorage.getItem('auth_token');
		//var myLat;
		//var myLong;
		if(this.isLoggedIn()){
			//podemos trabajar con los eventos
			/*if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){					
					myLat = position.coords.latitude;		
					myLong = position.coords.longitude;
				});
			}else{
				//NO PODEMOS TRABAJAR
			}*/

			var eventOptions = {
				lat: 38.389482,
				lon: -0.4408048,
				filter: true
			}	
			this.fbEvent.setToken(this.mytkn)
				.then(() => {
				  return this.fbEvent.getEvents(eventOptions);
				})
				.then(events => {
				  console.log("count", events.length);
				  console.log("first event", events[0]);
				})
				.catch(err => {
				  console.log(err);
				})
		}
	}


	/**
	* Login with minimal permissions. This allows you to see their public profile only.
	*/
	login() {
		this.fb.login()
			.then((res: LoginResponse) => {
				console.log('Logged in', res);
		})
			.catch(this.handleError);
	}

	/**
	* Login with additional permissions/options
	*/
	loginWithOptions() {
		const loginOptions: LoginOptions = {
			enable_profile_selector: true,
			return_scopes: true,
			scope: 'public_profile, user_friends, email, pages_show_list, user_events'
		};

		this.fb.login(loginOptions)
			.then((res: LoginResponse) => {
				console.log('Logged in', res);
    			localStorage.setItem('auth_token', res.authResponse.accessToken);
    			myGlobals.setUSER_TOKEN(res.authResponse.accessToken);
    			location.reload();
		})
			.catch(this.handleError);
		
	}

	logout(){
		localStorage.removeItem('auth_token');
		this.loggedIn = false;
	}

	isLoggedIn() {
	    return this.loggedIn;
	}

	getLoginStatus() {
		this.fb.getLoginStatus()
			.then(console.log.bind(console))
			.catch(console.error.bind(console));
	}

	/**
	* Get the user's profile
	*/
	getProfile() {
		this.fb.api('/me')
			.then((res: any) => {
				console.log('Got the users profile', res);
			})
			.catch(this.handleError);
	}


	/**
	* Get the users friends
	*/
	getFriends() {
		this.fb.api('/me/friends')
			.then((res: any) => {
				console.log('Got the users friends', res);
			})
			.catch(this.handleError);
	}

/* ------------ GOOGLE MAPS ------------ */

	markers: marker[] = [
		{
		  lat: 51.673858,
		  lng: 7.815982,
		  label: 'A',
		  draggable: true
		},
		{
		  lat: 51.373858,
		  lng: 7.215982,
		  label: 'B',
		  draggable: false
		},
		{
		  lat: 51.723858,
		  lng: 7.895982,
		  label: 'C',
		  draggable: true
		}
	]

	clickedMarker(label: string, index: number) {
    	console.log(`clicked the marker: ${label || index}`)
  	}

  	mapClicked($event: any) {
		this.markers.push({
			lat: $event.coords.lat,
			lng: $event.coords.lng,
			draggable: true
		});
	}
	markerDragEnd(m: marker, $event: MouseEvent) {
    	console.log('dragEnd', m, $event);
  	}


	private handleError(error) {
		console.error('Error processing action', error);
	}
}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
