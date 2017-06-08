import { Component, OnInit, NgZone, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import {FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent} from 'ngx-facebook';

import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

import { EventsService } from './events.service';

import { MapsAPILoader  } from 'angular2-google-maps/core';

import {GoogleMapsAPIWrapper} from "../../node_modules/angular2-google-maps/core/services/google-maps-api-wrapper";

import { Subscription } from 'rxjs/Subscription';

import * as myGlobals from '../../globals'; 

import { Event } from './Event';
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'Login con FACEBOOK y mapa de GOOGLE';
	lat: number = 0;
  	lng: number = 0;
  	zoom: number = 12;

  	subscription: Subscription;

  	events: Event[];

  	markers: marker[] = [];

  	mark

  	private loggedIn = false;
  	private mytkn;
  	private myLat;
  	private myLong;
  	private myCoords;

  	private faceName;

  	//hallar direccion
  	private geocoder;
  	private userCity;
  	private userProv;


  	//called first time before ngOninit()  	
	constructor(private fb: FacebookService, 
				private http: Http,
				private router: Router,
				private eventsService: EventsService,
				private mapsAPILoader: MapsAPILoader,
				private mapApiWrapper: GoogleMapsAPIWrapper,
				private ngZone : NgZone) {

		console.log('Initializing Facebook');

		fb.init({
			appId: '631545433723193',
			version: 'v2.9'
		});		

	    this.loggedIn = !!localStorage.getItem('auth_token');
	}


	//called after the constructor and called  after the first ngOnChanges() 
	ngOnInit(){
		//inicializar google maps
		this.mapsAPILoader.load().then(() => {
		    console.log('google script loaded');
		    this.geocoder = new google.maps.Geocoder();


		    if (localStorage.getItem("auth_token") != null) {
				this.mytkn = localStorage.getItem('auth_token');		
				if(this.isLoggedIn()){
					//podemos trabajar con los eventos
					if(navigator.geolocation){
						navigator.geolocation.getCurrentPosition((position) => {
							Promise.all([
								this.myLat = position.coords.latitude,
								this.myLong = position.coords.longitude,
								this.lat = this.myLat,
								this.lng = this.myLong,
								this.getLocationName(this.lat, this.lng),
								//guardar coordenadas para html
								this.myLat = this.myLat.toString(),
								this.myLong = this.myLong.toString(),
								this.myCoords = this.myLat.substring(0,7) + ", " + this.myLong.substring(0,7)							
					     	  ]).then(() => this.eventsService.searchEvents(this.myLat, this.myLong));							
							
						});	
						Promise.all([
							this.subscription = this.eventsService.getAllEvents()
								.subscribe(ev => { 
									this.events  = ev;																		
								 })
						]).then(() => this.drawEvents());						
						
					}else{
						//NO PODEMOS TRABAJAR
					}
				}
			}
			if (localStorage.getItem("name") != null) {
				this.faceName = localStorage.getItem('name');
				console.log(this.faceName);
			}
		});		
	}

	ngOnChanges(){
		if (localStorage.getItem("name") != null) {
			this.faceName = localStorage.getItem('name');
		}
	}



	/* ************ MANEJAR EVENTOS *************** */
	
	drawEvents(){
		if (localStorage.getItem("storageEvents") != null && localStorage.getItem("storageEvents") != '[]'){
			var aux = localStorage.getItem("storageEvents");
			this.events = JSON.parse(aux);
			var formattedDateS, formattedDateE;
			var latlngAux;
			var latAdded = 0;
			var lngAdded = 0;

			for(var i of this.events){	
				console.log("evento concreto", i);					

				formattedDateS = this.convertDate(i.start_time);	  	
				formattedDateE = this.convertDate(i.end_time);

				//valor de lat + long para comprobar duplicados
				latlngAux = ""+i.latitude+i.longitude;

				if(this.markers.length > 0){
					for(var j of this.markers){
						if(j.latlng == latlngAux){
							latAdded = 0.002;
							lngAdded = 0.002;
							console.log("ya existe uno");
						} 
						else{
							latAdded = 0;
							lngAdded = 0;
							console.log("no existe", i.latitude);
							
						}
					}		
				}	
				
				this.markers.push({
					lat: i.latitude+latAdded,
				  	lng: i.longitude+lngAdded,
				  	latlng: latlngAux,
				  	label: i.name,
				  	draggable: false,
				  	description: i.description,
				    start_time: formattedDateS,
				    end_time: formattedDateE,
				    attending: i.attending,
				    picture: i.picture,
				    place: i.place
				});				  		
						
			}
		}		
	}

	convertDate(inputFormat) {
  		function pad(s) { return (s < 10) ? '0' + s : s; }
  		var d = new Date(inputFormat);
  		return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
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
				this.loggedIn = true;
    			localStorage.setItem('auth_token', res.authResponse.accessToken);
    			myGlobals.setUSER_TOKEN(res.authResponse.accessToken);
    			this.getProfile();
    			
		})
			.catch(this.handleError);
		
	}

	logout(){
		localStorage.removeItem('auth_token');
		this.loggedIn = false;
		location.reload();
	}

	isLoggedIn() {
	    return this.loggedIn;
	}

	getLoginStatus() {
		this.fb.getLoginStatus()
			.then(console.log.bind(console))
			.catch(console.error.bind(console));
	}

	getLocationName(x, y){
    	var latlng = new google.maps.LatLng(x, y);
    	var aux = this;
    	this.geocoder.geocode({'latLng': latlng}, function(results, status) {
    		if (status == google.maps.GeocoderStatus.OK) {
    			if(results[1]){
					aux.userCity = results[1].address_components[0].long_name;
					aux.userProv = results[1].address_components[3].long_name;    				
    			}
    			else{
    				console.log("Sin resultados");
    			}
    		}
    		else{
    			console.log("Geocoder fallado");
    		}
    	});
    }

	/**
	* Get the user's profile
	*/
	getProfile() {
		this.fb.api('/me')
			.then((res: any) => {
				console.log('Got the users profile', res);
				var str = res.name;
				var i = str.indexOf(' ');
				str = str.substring(0, i);
				console.log('name:', str);
				localStorage.setItem('name', str);
				location.reload();
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

	setCenterMap(){
		//console.log(this.myLat);		
		//convertir en number
		this.lat = +this.myLat;
		this.lng = +this.myLong;
		console.log(this.lat);
		var latlng = new google.maps.LatLng(this.lat, this.lng);
		console.log(latlng);
		//this.map.panTo(new google.maps.LatLng(this.lat, this.lng));
		//mapa
	    /*this.mapApiWrapper.getNativeMap()
  			.then((map)=> {
  				map.setCenter(new google.maps.LatLng(0.321, 0.321));	
			});*/
		this.mapApiWrapper.panTo(latlng);
	}

	clickedMarker(label: string, index: number) {
    	console.log(`clicked the marker: ${label || index}`)
  	}

  	mapClicked($event: any) {
		/*this.markers.push({
			lat: $event.coords.lat,
			lng: $event.coords.lng,
			draggable: true
		});*/
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
	latlng: string;
	label?: string;
	description: string;
    start_time: string;
    attending: number;
    picture: string;
	draggable: boolean;
	place: string;
	end_time: string;
}
