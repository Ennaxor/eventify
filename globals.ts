'use strict';
export var USER_TOKEN=''; 

export function setUSER_TOKEN(tkn: string) {
	USER_TOKEN = tkn;
}

export function getUSER_TOKEN() {
	return USER_TOKEN;
}