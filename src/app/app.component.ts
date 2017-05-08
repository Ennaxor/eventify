import { Component } from '@angular/core';

import {FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent} from 'ngx-facebook';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'app works!';

	constructor(private fb: FacebookService) {
		console.log('Initializing Facebook');

		fb.init({
			appId: '631545433723193',
			version: 'v2.9'
		});
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
			scope: 'public_profile,user_friends,email,pages_show_list'
		};

		this.fb.login(loginOptions)
			.then((res: LoginResponse) => {
				console.log('Logged in', res);
		})
			.catch(this.handleError);
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


	private handleError(error) {
		console.error('Error processing action', error);
	}
}
