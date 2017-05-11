import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

	constructor(private http: Http) { 
  		
  	}


	  getUser() {
	    return this.http.get('/api/login')
	      .map(res => res.json());
	  }


	
}
