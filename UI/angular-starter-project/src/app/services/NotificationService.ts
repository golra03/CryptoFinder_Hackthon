import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApplicationComponents } from '../services/applicationComponents';

declare var swal:any;
@Injectable()

export class NotificationService{

	constructor(private http:Http,private appConstants:ApplicationComponents){

	}

	errorNotification(){
		swal({
		    title: 'Something went wrong',
		    text: "somthing seems to have gone wrong, please contacft your administrator",
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: '#3085d6',
		    cancelButtonColor: '#d33',
		    confirmButtonText: 'Ok',
		    confirmButtonClass: 'confirm-class',
		    closeOnConfirm: true,
		},function(isConfirm){ 
			console.log(isConfirm);
			console.log("notification sent");
		});
	}

	loginNotification(){
		swal({
		    title: 'Login Required',
		    text: "Please login to continue using the application",
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: '#3085d6',
		    cancelButtonColor: '#d33',
		    confirmButtonText: 'Ok',
		    confirmButtonClass: 'confirm-class',
		    closeOnConfirm: true,
		},function(isConfirm){
			var data = localStorage.getItem("login");
			this.http.post(this.appConstants.getUrlAndPort()+"/admin/logout",data);
			localStorage.clear();
			location.reload();
		}.bind(this));
	}

	invalidLogin(){
		swal("Invalid Login","The credentials are invalid,please try again");
	}

}
