import { Injectable} from '@angular/core';

@Injectable()
export class NavigationItems {

	private role:any = "";

	setRole(arg){
		this.role = arg;
	}
	navigationListForCustomer : Array<Object> = [	
		{
			"title":"Menu",
			"items": [
			{
				"url":"customer/Registration",
				"icon":"sli-chart",
				"title":"Customer KYC Process",
				"items":[],
				"id":"customer"
			},
			{
				"url":"loans/RequestPage",
				"icon":"sli-home",
				"title":"Loan Request",
				"items":[],
				"id":"institutes"
			},{
				"url":"repay/loans",
				"icon":"sli-home",
				"title":"Repay Loans",
				"items":[],
				"id":"repay"
			}]
		}
	];
	navigationListForUser : Array<Object> = [	
		{
			"title":"Menu",
			"items": [
			{
				"url":"get/loans",
				"icon":"sli-chart",
				"title":"Get All Loans",
				"items":[],
				"id":"getLoans"
			}]
		}
	];
	constructor() {
		if(JSON.parse(localStorage.getItem("login")))
			this.role = JSON.parse(localStorage.getItem("login")).role;
  	}

	getItems():Array<Object>{
		if(this.role === 1){
			return this.navigationListForCustomer;					
		}else{
			return this.navigationListForUser;
		}
	}
}