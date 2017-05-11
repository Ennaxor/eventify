import { Component } from '@angular/core';

import {FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent} from 'ngx-facebook';
import {FacebookEventsService} from 'facebook-events-by-location';
import { UsersService } from './users.service';

import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

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

  	
	constructor(private fb: FacebookService, 
				private userService: UsersService,
				private http: Http) {

		console.log('Initializing Facebook');

		fb.init({
			appId: '631545433723193',
			version: 'v2.9'
		});

		/*this.headers = new Headers();
	    this.headers.append("Content-Type", 'application/json');
	    this.headers.append("Authorization", 'confidential data');*/

	    this.loggedIn = !!localStorage.getItem('auth_token');
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
				var aux = res.authResponse.accessToken;
				let body = JSON.stringify(aux);
				let headers = new Headers();
    			headers.append('Content-Type', 'application/json');
    			let options = new RequestOptions({ headers: headers });

				return this.http.post('/login', {aux}, options)
					.subscribe(
						response => {
							localStorage.setItem('auth_token', res.authResponse.accessToken);
							this.loggedIn = true;
						},
						error => {
							console.log(error.text());
						}
					);		

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
