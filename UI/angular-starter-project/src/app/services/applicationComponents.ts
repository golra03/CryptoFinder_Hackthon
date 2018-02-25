import { Injectable } from '@angular/core';

@Injectable()

export class ApplicationComponents{
	constructor(){
	}

	getUrlAndPortForCustomer(){
		//return "https://192.168.0.36:3001";
		return "https://localhost:3000";
	}
	getUrlAndPortForStudent(){
		//return "https://192.168.0.36:3003";
		return "https://localhost:3004";
	}
	getUrlAndPortForBlockchainIssuer(){
		return "https://localhost:3008";
	}
	getUrlAndPortForApplicationAdmin(){
		return "https://localhost:3010";
	}	
	getUrlAndPortForConsumer(){
//		return "https://192.168.0.36:3002"
		return "https://localhost:3002";
	}
}