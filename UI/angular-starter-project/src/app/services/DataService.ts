import { Injectable } from '@angular/core';
import { RestCallsComponent } from '../services/httpServices';
import { ApplicationComponents } from '../services/applicationComponents';
import { NotificationService } from "../services/NotificationService";

@Injectable()

export class DataService{

	private universityData:any;
	private userData:any;

	constructor(
		private http:RestCallsComponent,
		private appConstants:ApplicationComponents,
		private notify:NotificationService
		){
        console.log("data service invoked");
	}

	setUniversityData(arg){
		this.universityData = arg;
	}

	setUser(){
		var id = {id:JSON.parse(localStorage.getItem("login")).id};
        if(this.userData){
            this.http.getUniversityUserForId(id).subscribe(
                (response)=>{
                    console.log("Data Service: User :Data")
                    var temp = response.json();
                    console.log(temp);
                    if(!temp.status)
                        this.userData = response.json();
                    else
                        this.userData = {};
                },
                    (error)=>{
                      console.log(error);
                });
            console.log("Data Service : user data not present");
        }else{
            console.log("Data Service : user data present");
        }
		
	}

	getUniversityData(){
		return this.universityData;
	}

	getUserData(){
		return this.userData;
	}
}